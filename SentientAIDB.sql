PGDMP  :                    }            SentientAIDB    17.1    17.1 #    3           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            4           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            5           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            6           1262    18574    SentientAIDB    DATABASE     �   CREATE DATABASE "SentientAIDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1254';
    DROP DATABASE "SentientAIDB";
                     postgres    false                        3079    18581 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            7           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            �            1255    18681    notify_context_changes()    FUNCTION     �   CREATE FUNCTION public.notify_context_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM pg_notify('context_changes', '');
    RETURN NEW;
END;
$$;
 /   DROP FUNCTION public.notify_context_changes();
       public               postgres    false            �            1255    18687    notify_past_visions_changes()    FUNCTION     �   CREATE FUNCTION public.notify_past_visions_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM pg_notify('past_visions_changes', '');
    RETURN NEW;
END;
$$;
 4   DROP FUNCTION public.notify_past_visions_changes();
       public               postgres    false            �            1255    18685 $   notify_short_term_memories_changes()    FUNCTION     �   CREATE FUNCTION public.notify_short_term_memories_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM pg_notify('short_term_memories_changes', '');
    RETURN NEW;
END;
$$;
 ;   DROP FUNCTION public.notify_short_term_memories_changes();
       public               postgres    false            �            1255    18683    notify_vitals_changes()    FUNCTION     �   CREATE FUNCTION public.notify_vitals_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM pg_notify('vitals_changes', '');
    RETURN NEW;
END;
$$;
 .   DROP FUNCTION public.notify_vitals_changes();
       public               postgres    false            �            1259    18629    context    TABLE     �   CREATE TABLE public.context (
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
       public               postgres    false    220            8           0    0    migrations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
          public               postgres    false    219            �            1259    18655    short_term_memories    TABLE     z  CREATE TABLE public.short_term_memories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    action character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_accessed timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total_accesses integer DEFAULT 0 NOT NULL,
    type character varying NOT NULL
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
       public               postgres    false    220    219    220            .          0    18629    context 
   TABLE DATA                 public               postgres    false    222   �)       *          0    18599    hormones 
   TABLE DATA                 public               postgres    false    218   )/       /          0    18646    long_term_memories 
   TABLE DATA                 public               postgres    false    223   �0       ,          0    18606 
   migrations 
   TABLE DATA                 public               postgres    false    220   h2       0          0    18655    short_term_memories 
   TABLE DATA                 public               postgres    false    224   �2       -          0    18622    vitals 
   TABLE DATA                 public               postgres    false    221   5       9           0    0    migrations_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);
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
       public                 postgres    false    223            �           2606    18663 +   short_term_memories short_erm_memories_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.short_term_memories
    ADD CONSTRAINT short_erm_memories_pkey PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.short_term_memories DROP CONSTRAINT short_erm_memories_pkey;
       public                 postgres    false    224            �           2620    18682    context context_changes_trigger    TRIGGER     �   CREATE TRIGGER context_changes_trigger AFTER INSERT ON public.context FOR EACH ROW EXECUTE FUNCTION public.notify_context_changes();
 8   DROP TRIGGER context_changes_trigger ON public.context;
       public               postgres    false    222    235            �           2620    18686 7   short_term_memories short_term_memories_changes_trigger    TRIGGER     �   CREATE TRIGGER short_term_memories_changes_trigger AFTER INSERT ON public.short_term_memories FOR EACH ROW EXECUTE FUNCTION public.notify_short_term_memories_changes();
 P   DROP TRIGGER short_term_memories_changes_trigger ON public.short_term_memories;
       public               postgres    false    224    237            �           2620    18684    vitals vitals_changes_trigger    TRIGGER     �   CREATE TRIGGER vitals_changes_trigger AFTER INSERT ON public.vitals FOR EACH ROW EXECUTE FUNCTION public.notify_vitals_changes();
 6   DROP TRIGGER vitals_changes_trigger ON public.vitals;
       public               postgres    false    236    221            .   <  x��V�n�6��+xK�Z�d[�����(�[��詠��ĚU����7��mv/�C�c�μ���>���E?��$�!תX���ɋGU.���X���ߥ��������V�<�m�Le�M�4���&����N�2����(d+��Z꼾
�	)�G<qiȒ8��H��X*E9��F䤺z�ښ�x�NPwV�t-������U�Zv�«���J�x����U�:QY�
�<s�´�&�$ګ�{WB��F�PN����Z�3_.s�n�q�W�t'\s�$J��I�9��D������W��Q\H�7$zKgŁKy]��2c_�A�8{6�/R��E���s�(�ʗB�,C�f��ɮ�А�75HO����z�9�+��<hY���xݯ��u�N�x��"ɞ��y�^��x�m��7O�-��IS�|W�w�!Z�����,�iVFrGی
H�,GM�KU �Fz�b<m�Q�A�#YȒZU�POVI�@1pȍ9� MO�c $X�5�lTR�fhq��Q?��?E�^�Ah���@�1b3�I�m?-���[	x��1z�e�e���x�D�7��eMA��BIN�yXE#�Y����Y�,�Y��Y�K@֪��P�pDA�ΫvА)� ����rF�A�ж#<���K�v�ܤZ��i�'$Si*8�R�蜞l#{q�76ʖ;�#��:�T��W�Ż�]�>��"0�� �+Ӂ00d����_��\��������v	���{��F V��bBu~(���n^���e. ���(br�;C|�=�7	rp��sE��nB�t�:ˑ��������Iވ��p��qo�lms�))��)����׷�g����z��n���d�b��v�:�S�-�}��q��K��C,s�4S�n��F�1U�v�h��8�0��􈔯$md�X+5=�Y��v����a1ZP��.?�����g�c��4_7�|��Z:�#���%*�0rG��;&�*���E�2�ĩ� ���j�cƼ%�b��lc� �0�h>؆&ds;e��>��svt_h�:�x M)�ֹyߋ�m�`De�8]�m�$�%�~�Ǆ��I���8Jw�<�(O��&��.���1s*�������73�^FG�-�e�~̀��3 �O�G�0����`l�]`հ[�0��1&	[#X����U�f�Y��{O��;�ԣ]����n��q�E��Q*:L�9-,��	��{%�d�ǋ���g�����K�^vA4a>��q�z,������c��N�0W$���92Bg�Խ���W������ltA2!XA���z�m�,o�t��W�f��'�N�� ���O      *   j  x��ұn�0�=O�--�DY:u������H�+�ݢ���x8��d#�?_ߞ�w�����3�C~���N�tw�)��Ѝ�%�}������[w��:Z�>@
� aI�*`C�ȅ���=�s<����?��i}b���F聒�m@�lU �C����\�:S[��1
��\b��s��

'�d����֚7���bIN�1X��1P��9�t"�/�L\���0-m�7x����E�B���C[�Q:k�/u�s��a��m�{Y�[fj��H}B�����a�"�2���WI�J���X ߷�Fe��Gm#���ś��yCD6&�'j+}�O��hPn�\eY벶�'�vۍ�      /   �  x�͓K��0�����d�ZF�[Y�t�n�,];&~�mɿ��I(m��B �9z|�^ޞ��a��~����k}ލC��q�7=���b��6d�'t3���3��2�\�7�{��egם�1��`�Z���8�n��p��-��eds��ۧ�_���q�X�lQB�F"�Ģ�ąP��A����2I(#�CaJ*J�r��ʏ�
�q�ع�T�P�1�N*%��0̀%[�8/�ȹ�8kO���Mm-w���9R[n�6RxA]�}� e)Un;����U�����?(��,(�dQ�S�lQ������y{�*����@�V�uE�P����'�"��ubj�
+Q{a�5�8r�O�X��m���Fpܴ�fr'�:�w��p���}���$���܎�4%k�n���o��5������$|Q      ,   
   x���          0   �  x�uS�n�0��+_�b��M�f���C�ٮ-31Y2$���1�~!�0d�5�M�]�i>�|�Q�O�_����mWjV����@�Y5�X��ጫP�&�U+)h�a�J��$�`�S�%�[:��7���?��xv�_�j>��T]L.��r�T�'�3ZWS*f%��0~ O��O�h<��P�W����BM�nh1-O� ��0�-l�`���4���Z ��VS
9�ه؀7&�	CuEF ���T[�L�"���?�m�-(۴]�*7�B[[C��X����-��EWepQZ��lgD�Rwҏ��t*��9Ћ���@��l��\Q����c�*�7u�=`i�	�Tb�@���I��ăT��_��薴��#�t�H�������%~j4������+N�$�Vc/���хʎx4~�����vYX����V�e�&�֢�f�,N���臕_@��G9�?#��s���u�k���J�j깅���d�.#����l�M/+,eU@��4�nt!����;2/����{������kgɝ5FN'�ĥ��T�k
� ��D��a�6k뢍�4\V�#U��`����em��D{F�y1��Ť����bZ,fE6���/��,.�# �3�����x���Z"      -   q   x���v
Q���W((M��L�+�,I�)V��L�Q�K�M�Q�I-K��Ts�	uV�P7N43NM65�5I�0�5100ҵ�0��M1111NI4I644P�QP�IM- 24���� �j�     