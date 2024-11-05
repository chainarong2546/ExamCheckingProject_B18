--------------------------------------------------------------------------
--------------------------- Table and Sequence ---------------------------

CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY NOT NULL,
    name CHARACTER VARYING(100) UNIQUE NOT NULL,
    detail CHARACTER VARYING(255) NOT NULL
);

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY NOT NULL,
    username CHARACTER VARYING(25) UNIQUE NOT NULL,
    password CHARACTER VARYING(60) NOT NULL,
    first_name CHARACTER VARYING(50) NOT NULL,
    last_name CHARACTER VARYING(50) NOT NULL,
    email CHARACTER VARYING(255) UNIQUE NOT NULL,
    role_id INTEGER REFERENCES public.roles(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.templates (
    id SERIAL PRIMARY KEY,
    name CHARACTER VARYING(255) NOT NULL,
    total_no INTEGER NOT NULL,
    image_url CHARACTER VARYING(255) NOT NULL,
    pdf_url CHARACTER VARYING(255) NOT NULL,
    marker_qr JSONB NOT NULL, -- {"sx": 100, "sy": 200, "ex": 300, "ey": 400"}
    marker_qr_data CHARACTER VARYING(255) NOT NULL,
    marker_tl JSONB NOT NULL, -- {"sx": 100, "sy": 200, "ex": 300, "ey": 400"}
    marker_tr JSONB NOT NULL,
    marker_bl JSONB NOT NULL,
    marker_br JSONB NOT NULL,
    marker_tl_center JSONB NOT NULL,
    marker_tr_center JSONB NOT NULL,
    marker_bl_center JSONB NOT NULL,
    marker_br_center JSONB NOT NULL,
    square_std_id JSONB NOT NULL, -- squares: [{"sx": 100, "sy": 200, "ex": 300, "ey": 400"}, ...]
    square_answer JSONB NOT NULL, -- squares: [[{"sx": 100, "sy": 200, "ex": 300, "ey": 400"}, ...], [{"sx": 100, "sy": 200, "ex": 300, "ey": 400"}, ...], ........]
    un_use BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.answers (
    id SERIAL PRIMARY KEY,
    name CHARACTER VARYING(255) NOT NULL,
    owner_id INTEGER REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT NULL,
    subject CHARACTER VARYING(255) NOT NULL,
    year INTEGER NOT NULL,
    term INTEGER NOT NULL,
    total_no INTEGER NOT NULL,
    answer JSONB NOT NULL, -- answers: [{"choice": [1], "point": 1}, {"choice": [2, 3], "point": 1"}]
    archive BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE public.groups (
    id SERIAL PRIMARY KEY,
    name CHARACTER VARYING(255) NOT NULL,
    subject CHARACTER VARYING(255) NOT NULL,
    year INTEGER NOT NULL,
    term INTEGER NOT NULL,
    owner_id INTEGER REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT NULL,
    template_id INTEGER REFERENCES public.templates(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT NULL,
    answer_id INTEGER REFERENCES public.answers(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT NULL,
    un_use BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.sheets (
    id SERIAL PRIMARY KEY,
    name CHARACTER VARYING(100) UNIQUE NOT NULL,
    group_id INTEGER REFERENCES public.groups(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    template_id INTEGER REFERENCES public.templates(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    answer_id INTEGER REFERENCES public.answers(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    predict_ans_detail JSONB, -- results: [{"a": {"cross": 10, "blank": 80, "cancle": 5, "invalid": 15"}, "b": {"cross": 90, "blank": 10, "cancle": 5, "invalid": 15"}}]
    predict_ans_result JSONB,
    predict_std_result JSONB,
    predict_std_detail JSONB, -- results: [{"one": 5, "two": 80, "three": 10, "five": 20", ...}] 
    total_score INTEGER,
    status CHARACTER VARYING(10) NOT NULL DEFAULT 'IDLE',
    process_id CHARACTER VARYING(100),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

