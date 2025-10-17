% HTTP GET para obter factos
:- http_handler(root(show), get_facts_json, []).
get_facts_json(_Request) :-
    mostra_factos_json(JSON),
    reply_json(JSON).

% HTTP POST para inferir probabilidade de via aérea difícil
:- http_handler(root(inferir_via_aerea), post_inferir_via_aerea, [method(post)]).
post_inferir_via_aerea(Request) :-
    http_read_json_dict(Request, Dict),
    inferir_via_aerea(Dict, CF),
    reply_json(_{'cf': CF}).

% HTTP GET para explicações "como"
:- http_handler(root(explain), get_explanation_json, []).
get_explanation_json(Request) :-
    http_parameters(Request, [id(ID, [integer])]),
    como_json(ID, JSON),
    reply_json(JSON).