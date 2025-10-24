% HTTP GET para obter factos do paciente
:- http_handler(root(PatientID/facts), get_facts_json(PatientID), []).

get_facts_json(PatientID, _Request) :-
    mostra_factos_json(PatientID, JSON),
    reply_json(JSON).

% HTTP GET para obter todos os factos
:- http_handler(root(facts), get_facts_json, []).
get_facts_json(_Request) :-
    mostra_factos_json(JSON),
    reply_json(JSON).

% HTTP POST para inferir probabilidade de via aérea difícil
:- http_handler(root(assessment), post_inferir_via_aerea, [method(post)]).

post_inferir_via_aerea(Request) :-
    http_read_json_dict(Request, Dict),
    inferir_via_aerea(Dict),
    PatientID = Dict.patientId,
    build_inferir_via_aerea_json(PatientID, JSONFinal),
    reply_json(json(JSONFinal)).

build_inferir_via_aerea_json(PatientID, JSONFinal) :-
    findall(Name=CF, facto(PatientID, _, mnemonica_cf(Name, CF)), JSON1),

    (   facto(PatientID, _, via_aerea_dificil(true))
    ->  append(JSON1, [via_aerea_dificil=true], JSON2)
    ;   append(JSON1, [via_aerea_dificil=false], JSON2)
    ),

    ultimo_rec_processo(PatientID, ValorRec),
    append(JSON2, [ultimo_rec_processo=ValorRec], JSONFinal).

% HTTP GET para explicações "como"
:- http_handler(root(explain), get_explanation_json, []).
get_explanation_json(Request) :-
    http_parameters(Request, [
        id(ID, [integer]),
        patientId(PatientID, [optional('unknown')])
    ]),
    %como_json(PatientID, ID, JSON),
    reply_json(JSON).

% HTTP POST para Laringoscopia Direta
:- http_handler(root(laringoscopia), post_laringoscopia, [method(post)]).
post_laringoscopia(Request) :-
    http_read_json_dict(Request, Dict),
    PatientID = Dict.patientId,
    laringoscopia(PatientID, Dict),
    reply_processo_json(PatientID).

% HTTP POST para Máscara Facial
:- http_handler(root(mascara_facial), post_mascara_facial, [method(post)]).
post_mascara_facial(Request) :-
    http_read_json_dict(Request, Dict),
    PatientID = Dict.patientId,
    mascara_facial(PatientID, Dict),
    reply_processo_json(PatientID).
