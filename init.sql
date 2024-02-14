create table clientes (
	id SERIAL constraint PK_ClienteId primary key,
	nome VARCHAR(50),
	limite INTEGER not null
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

CREATE TABLE saldos (
	id SERIAL PRIMARY KEY,
	cliente_id INTEGER NOT NULL,
	valor INTEGER NOT NULL,
	CONSTRAINT fk_clientes_saldos_id
		FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE INDEX ON public.transacoes (cliente_id);
CREATE INDEX ON public.transacoes (cliente_id, realizado_em DESC);

INSERT INTO clientes (nome, limite)
VALUES
    ('o barato sai caro', 1000 * 100),
    ('zan corp ltda', 800 * 100),
    ('les cruders', 10000 * 100),
    ('padaria joia de cocaia', 100000 * 100),
    ('kid mais', 5000 * 100);
INSERT INTO saldos (cliente_id, valor) SELECT id, 0 FROM clientes;