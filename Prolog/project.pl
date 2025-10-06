:- consult('engine.pl').

main :-
    servidor(8080),
    carrega_bc('veiculos2.txt').

:- main.