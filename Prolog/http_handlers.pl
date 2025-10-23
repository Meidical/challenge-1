% HTTP GET para obter factos
:- http_handler(root(show), get_facts_json, []).
get_facts_json(_Request) :-
    mostra_factos_json(JSON),
    reply_json(JSON).

% HTTP POST para inferir probabilidade de via aérea difícil
:- http_handler(root(inferir_via_aerea), post_inferir_via_aerea, [method(post)]).
post_inferir_via_aerea(Request) :-
    http_read_json_dict(Request, Dict),
    inferir_via_aerea(Dict),
    build_inferir_via_aerea_json(JSONFinal),
    reply_json(json(JSONFinal)).

build_inferir_via_aerea_json(JSONFinal) :-
    findall(Name=CF, facto(_, mnemonica_cf(Name, CF)), JSON1),

    (facto(_, via_aerea_dificil(true)),
    append(JSON1, [via_aerea_dificil=true], JSON2);
    append(JSON1, [via_aerea_dificil=false], JSON2)),

    ultimo_rec_processo(ValorRec),
    append(JSON2, [ultimo_rec_processo=ValorRec], JSONFinal).

% HTTP GET para explicações "como"
:- http_handler(root(explain), get_explanation_json, []).
get_explanation_json(Request) :-
    http_parameters(Request, [id(ID, [integer])]),
    como_json(ID, JSON),
    reply_json(JSON).

% HTTP Post para Laringoscopia Direta
:- http_handler(root(laringoscopia), post_laringoscopia, [method(post)]).
post_laringoscopia(Request) :-
    http_read_json_dict(Request, Dict),
    laringoscopia(Dict),

    reply_processo_json.

% HTTP Post para Mascara Facial
:- http_handler(root(mascara_facial), post_mascara_facial, [method(post)]).
post_mascara_facial(Request) :-
    http_read_json_dict(Request, Dict),
    mascara_facial(Dict),

    reply_processo_json.