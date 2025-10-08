:- consult('engine.pl').

main :-
    servidor(8080),
    consult('veiculos2.txt').
:- main.