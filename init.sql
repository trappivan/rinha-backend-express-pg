create table clientes (
	id SERIAL constraint PK_ClienteId primary key,
	nome VARCHAR(50),
	limite INTEGER not null,
	saldo INTEGER not null
);

create table transacoes (
	id SERIAL primary key,
	realizado_em varchar(50),
	tipo varchar(1),
	valor int,
	descricao varchar(10),
	cliente_id int,
	constraint FK_TransacId foreign key (cliente_id) references clientes(id)
);

CREATE INDEX ON public.transacoes (cliente_id);
CREATE INDEX ON public.transacoes (cliente_id, realizado_em DESC);

INSERT INTO clientes (nome, limite, saldo)
VALUES
    ('o barato sai caro', 1000 * 100, 0),
    ('zan corp ltda', 800 * 100, 0),
    ('les cruders', 10000 * 100, 0),
    ('padaria joia de cocaia', 100000 * 100, 0 ),
    ('kid mais', 5000 * 100, 0);

CREATE OR REPLACE FUNCTION generate_json_output(_id integer) RETURNS JSON AS $$
DECLARE
  saldo_record RECORD;
  ultimas_transacoes_json json[];
  ultimas_transacoes_record RECORD;
  saldo_ret INTEGER := 0;
  limite_ret INTEGER := 0;
BEGIN
  SELECT saldo, limite INTO saldo_ret, limite_ret FROM clientes WHERE id = _id;

  FOR ultimas_transacoes_record IN 
    SELECT * FROM transacoes WHERE cliente_id = _id ORDER BY realizado_em DESC LIMIT 10
  LOOP
    ultimas_transacoes_json := ultimas_transacoes_json || 
      ARRAY[json_build_object(
        'valor', ultimas_transacoes_record.valor,
        'tipo', ultimas_transacoes_record.tipo,
        'descricao', ultimas_transacoes_record.descricao,
        'realizado_em', ultimas_transacoes_record.realizado_em
      )];
  END LOOP;

  IF array_length(ultimas_transacoes_json, 1) IS NULL THEN
    ultimas_transacoes_json := array[]::varchar[];
  END IF;

  -- Construct the JSON object
  RETURN json_build_object(
    'saldo', json_build_object(
      'total', saldo_ret,
      'data_extrato', NOW(),
      'limite', limite_ret
    ),
    'ultimas_transacoes', ultimas_transacoes_json
  );
END;
$$ LANGUAGE plpgsql;

create type inserir_transacao_result as (
	result_code int,
	result_message varchar(100),
	saldo integer,
	limite integer);

/*
 * 0: OK
 * 1: Cliente inválido.
 * 2: Saldo e limite insuficiente para executar a operação.
 */

-- data type
drop function if exists inserir_transacao; 

create or replace function inserir_transacao(
	cliente_id int,
	tipo char(1),
	valor int,
	descricao varchar(10))
returns inserir_transacao_result as $func$
declare
	cli clientes%rowtype;
	result inserir_transacao_result;
begin
	select * from clientes where id = cliente_id into cli;
	if not found then
		select 1, 'Cliente inválido.', null, null into result;
		return result;
	end if;

	if (tipo = 'd') then
		/* Se for débito, valida estouro de limite*/
		update clientes
		set saldo = saldo - valor
		where id = cliente_id
	      and saldo - valor + limite >= 0 
	    returning *
	   	into cli;
	   
		if not found then
			select 2, 'Saldo e limite insuficiente para executar a operação.', null, null into result;
			return result;
		end if;
	else
		/* Se for crédito, não valida estouro de limite*/
		update clientes
		set saldo = saldo + valor
		where id = cliente_id
	    returning *
	   	into cli;
	end if;

	insert into transacoes(cliente_id, tipo, valor, realizado_em, descricao)
	values (cliente_id, tipo, valor, now(), descricao);

	select 0, null, cli.saldo, cli.limite into result;
	return result;
end;
$func$ language plpgsql;