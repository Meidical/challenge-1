:- set_prolog_flag(encoding, utf8).

%% Servidor
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_server)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_parameters)).

% JSON
:- use_module(library(http/json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).

:- use_module(library(lists)).

% Incluir outros módulos
:- consult('engine.pl').
%:- consult('justification.pl').
:- consult('http_handlers.pl').
:- consult('rules.txt').
:- consult('utils.pl').

main :-
    http_server(http_dispatch, [port(8081)]).
:- main.