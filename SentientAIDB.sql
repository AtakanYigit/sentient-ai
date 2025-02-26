PGDMP  $                    }            SentientAIDB    17.1    17.1     5           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            6           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            7           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            8           1262    18574    SentientAIDB    DATABASE     �   CREATE DATABASE "SentientAIDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1254';
    DROP DATABASE "SentientAIDB";
                     postgres    false                        3079    18581 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            9           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            �            1259    18629    context    TABLE     �   CREATE TABLE public.context (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    context character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.context;
       public         heap r       postgres    false    2            �            1259    18599    hormones    TABLE     �   CREATE TABLE public.hormones (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL COLLATE pg_catalog."C",
    level integer NOT NULL
);
    DROP TABLE public.hormones;
       public         heap r       postgres    false    2            �            1259    18646    long_term_memories    TABLE     �  CREATE TABLE public.long_term_memories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    memory character varying NOT NULL,
    last_accessed timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total_accesses integer DEFAULT 0 NOT NULL,
    "levelOfImportance" integer NOT NULL,
    last_checked time with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total_accesses_last integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public.long_term_memories;
       public         heap r       postgres    false    2            �            1259    18606 
   migrations    TABLE     �   CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.migrations;
       public         heap r       postgres    false            �            1259    18605    migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.migrations_id_seq;
       public               postgres    false    220            :           0    0    migrations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
          public               postgres    false    219            �            1259    18672    past_visions    TABLE     �   CREATE TABLE public.past_visions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    vision character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
     DROP TABLE public.past_visions;
       public         heap r       postgres    false    2            �            1259    18655    short_term_memories    TABLE     V  CREATE TABLE public.short_term_memories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    action character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_accessed timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    totall_accesses integer DEFAULT 0 NOT NULL
);
 '   DROP TABLE public.short_term_memories;
       public         heap r       postgres    false    2            �            1259    18622    vitals    TABLE     �   CREATE TABLE public.vitals (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(56) NOT NULL,
    level integer DEFAULT 0 NOT NULL
);
    DROP TABLE public.vitals;
       public         heap r       postgres    false    2            {           2604    18609    migrations id    DEFAULT     n   ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
 <   ALTER TABLE public.migrations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            /          0    18629    context 
   TABLE DATA                 public               postgres    false    222   y"       +          0    18599    hormones 
   TABLE DATA                 public               postgres    false    218   �#       0          0    18646    long_term_memories 
   TABLE DATA                 public               postgres    false    223   5%       -          0    18606 
   migrations 
   TABLE DATA                 public               postgres    false    220   +&       2          0    18672    past_visions 
   TABLE DATA                 public               postgres    false    225   E&       1          0    18655    short_term_memories 
   TABLE DATA                 public               postgres    false    224   _&       .          0    18622    vitals 
   TABLE DATA                 public               postgres    false    221   y&       ;           0    0    migrations_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);
          public               postgres    false    219            �           2606    18636    context Context_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.context
    ADD CONSTRAINT "Context_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.context DROP CONSTRAINT "Context_pkey";
       public                 postgres    false    222            �           2606    18604    hormones Hormones_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.hormones
    ADD CONSTRAINT "Hormones_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.hormones DROP CONSTRAINT "Hormones_pkey";
       public                 postgres    false    218            �           2606    18613 )   migrations PK_8c82d7f526340ab734260ea46be 
   CONSTRAINT     i   ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.migrations DROP CONSTRAINT "PK_8c82d7f526340ab734260ea46be";
       public                 postgres    false    220            �           2606    18628    vitals Vitals_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.vitals
    ADD CONSTRAINT "Vitals_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.vitals DROP CONSTRAINT "Vitals_pkey";
       public                 postgres    false    221            �           2606    18665 *   long_term_memories long_term_memories_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.long_term_memories
    ADD CONSTRAINT long_term_memories_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.long_term_memories DROP CONSTRAINT long_term_memories_pkey;
       public                 postgres    false    223            �           2606    18680    past_visions past_visions_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.past_visions
    ADD CONSTRAINT past_visions_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.past_visions DROP CONSTRAINT past_visions_pkey;
       public                 postgres    false    225            �           2606    18663 +   short_term_memories short_erm_memories_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.short_term_memories
    ADD CONSTRAINT short_erm_memories_pkey PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.short_term_memories DROP CONSTRAINT short_erm_memories_pkey;
       public                 postgres    false    224            /   2  x�-��N�0��}����&JM�&p��C%�h㬩E{��۳l��ٙo���=��?<�46������·K�_����W�^n�wO���ݦ�ݶʨޖYY6eF��ˊjc�ږmue�K���ɋ��$ ���BM���>Fς�7����ф�ȑ����r�Ñ#�t��3� ��,�h�Շ0��2����H�ڡ�8�S��:�������|�I���I��L�g�)1�>!rG�?Y�'V(7vK��������vfќH�FI����#�0�0�����b{m�^k��,�招�l��B��      +   j  x��ұn�0�=O�--�DY:u������H�+�ݢ���x8��d#�?_ߞ�w�����3�C~���N�tw�)��Ѝ�%�}������[w��:Z�>@
� aI�*`C�ȅ���=�s<����?��i}b���F聒�m@�lU �C����\�:S[��1
��\b��s��

'�d����֚7���bIN�1X��1P��9�t"�/�L\���0-m�7x����E�B���C[�Q:k�/u�s��a��m�{Y�[fj��H}B�����a�"�2���WI�J���X ߷�Fe��Gm#���ś��yCD6&�'j+}�O��hPn�\eY벶�'�vۍ�      0   �   x�u�AO�0��;���.l�%�-2���H̖�镔�e�Jh5���ԝ��'��_����Ə��:��rnMC3�ঞ<�{�@O��F�23�ʇFiM��r	.({۞���'�CW����hZ�6����ߤ��^�^vGXǈ�i�q!�ĳB^R��2�3�-R3�Q�=�QBZT"�D�`.jg�[5�d��a��u��_�y��Ă.�Ť�0Kd!ez��CE_<�^E      -   
   x���          2   
   x���          1   
   x���          .   q   x���v
Q���W((M��L�+�,I�)V��L�Q�K�M�Q�I-K��Ts�	uV�P7N43NM65�5I�0�5100ҵ�0��M1111NI4I644P�QP�IM- 24���� �j�     