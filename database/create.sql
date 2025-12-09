drop schema if exists ccca cascade;

create schema ccca;

create table ccca.account (
    account_id uuid primary key,
    name       text,
    email      text,
    document   text,
    password   text
);

create table ccca.wallet (
    account_id uuid not null references ccca.account (account_id),
    asset_id   text not null check (asset_id in ('BTC', 'USD')),
    quantity   numeric not null default 0,
    primary key (account_id, asset_id)
);
