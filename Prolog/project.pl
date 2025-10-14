:- consult('engine.pl').

main :-
    servidor(8080),
    consult('rules.txt').
:- main.