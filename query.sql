-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.agent_availability (
  availability_id integer NOT NULL DEFAULT nextval('agent_availability_availability_id_seq'::regclass),
  agent_id character varying NOT NULL,
  availability_date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  notes character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  status character varying NOT NULL DEFAULT 'Available'::character varying,
  booked_by_user_id character varying,
  CONSTRAINT agent_availability_pkey PRIMARY KEY (availability_id),
  CONSTRAINT agent_availability_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.app_users(id),
  CONSTRAINT fkq0uc9r19c6tbtghuwejllfgou FOREIGN KEY (booked_by_user_id) REFERENCES public.app_users(id)
);
CREATE TABLE public.agent_availability_breaks (
  break_id integer NOT NULL DEFAULT nextval('agent_availability_breaks_break_id_seq'::regclass),
  availability_id integer NOT NULL,
  break_start time without time zone NOT NULL,
  break_end time without time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT agent_availability_breaks_pkey PRIMARY KEY (break_id),
  CONSTRAINT agent_availability_breaks_availability_id_fkey FOREIGN KEY (availability_id) REFERENCES public.agent_availability(availability_id)
);
CREATE TABLE public.app_users (
  id character varying NOT NULL,
  category character varying NOT NULL CHECK (category::text = ANY (ARRAY['USER'::character varying, 'AGENT'::character varying, 'ADMIN'::character varying]::text[])),
  country_code character varying,
  email character varying NOT NULL UNIQUE,
  first_name character varying,
  last_name character varying,
  password character varying NOT NULL,
  phone character varying,
  CONSTRAINT app_users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chat_history (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  bot_response character varying NOT NULL,
  timestamp timestamp without time zone NOT NULL,
  user_id character varying NOT NULL,
  user_message character varying NOT NULL,
  CONSTRAINT chat_history_pkey PRIMARY KEY (id)
);
CREATE TABLE public.claim_documents (
  claim_claim_id character varying NOT NULL,
  document character varying,
  CONSTRAINT fk4slodxsqkkgl0hxvc5jgc3pdt FOREIGN KEY (claim_claim_id) REFERENCES public.claims(claim_id)
);
CREATE TABLE public.claims (
  claim_id character varying NOT NULL,
  amount double precision NOT NULL,
  date_filed date NOT NULL,
  description character varying NOT NULL,
  policy_id character varying NOT NULL,
  status character varying NOT NULL,
  user_id character varying NOT NULL,
  claim_type character varying,
  date_of_incident date NOT NULL,
  CONSTRAINT claims_pkey PRIMARY KEY (claim_id)
);
CREATE TABLE public.notifications (
  id character varying NOT NULL,
  is_read boolean NOT NULL,
  message character varying NOT NULL,
  timestamp timestamp without time zone NOT NULL,
  type character varying NOT NULL,
  user_id character varying NOT NULL,
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.policies (
  policy_id character varying NOT NULL,
  user_id character varying,
  name character varying NOT NULL,
  type character varying NOT NULL,
  status character varying NOT NULL,
  premium double precision NOT NULL,
  coverage double precision NOT NULL,
  created_date date NOT NULL,
  clients integer NOT NULL,
  claims integer NOT NULL,
  start_date date,
  end_date date,
  agent_id character varying,
  CONSTRAINT policies_pkey PRIMARY KEY (policy_id)
);