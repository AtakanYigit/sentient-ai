PGDMP                      }            SentientAIDB    17.1    17.1     ,           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            -           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            .           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            /           1262    18574    SentientAIDB    DATABASE     �   CREATE DATABASE "SentientAIDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1254';
    DROP DATABASE "SentientAIDB";
                     postgres    false                        3079    18581 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            0           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
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
       public               postgres    false    220            1           0    0    migrations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
          public               postgres    false    219            �            1259    18655    short_term_memories    TABLE     V  CREATE TABLE public.short_term_memories (
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
       public         heap r       postgres    false    2            w           2604    18609    migrations id    DEFAULT     n   ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
 <   ALTER TABLE public.migrations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    220    220            '          0    18629    context 
   TABLE DATA                 public               postgres    false    222          #          0    18599    hormones 
   TABLE DATA                 public               postgres    false    218   K.       (          0    18646    long_term_memories 
   TABLE DATA                 public               postgres    false    223   �/       %          0    18606 
   migrations 
   TABLE DATA                 public               postgres    false    220   �0       )          0    18655    short_term_memories 
   TABLE DATA                 public               postgres    false    224   �0       &          0    18622    vitals 
   TABLE DATA                 public               postgres    false    221   �0       2           0    0    migrations_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);
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
       public                 postgres    false    224            '   *  x��ZM����ϯ���I�4͇�:0�	�:r
ZdSl�f��h�'�_$ο$�U5)������g$����իW�����/��y���oL;�*�-����mo>��̤_�C�l����S���?���7�˻u���n���z3߬�7�ۭ���.�W�nV6��3s�`lm
�*���.t.7��M���쫣���3s�}i��}�`tMt&�M�Cs4�1��dC׹�7����}h���GS�G��b��h�.�f縡k�v�-�ſ��O�?�����l��{�y��ECg����8�}���7�/
�Uo����!"��u��t���9قW���t��|&�^l� �p<k���vy41Ԯ/e˺]oq���K<�s�1�{~Y�nfZו�Z,y�Z�64�yY���=��ѳ�Kۡk�����Ql����mh�V�":�������1s��|�H�1h]��(���t�w�:��=y�[Ͱ�;�b���=�
�.@�h���K�=��OM����Q����wxQ��3=����8�a�w��s}�x�ə��F2tim�+�;���^�����|}e��{�����姟]<��̺]���<_���v=��W�"�g6�Z�v�uq}5e�;����"X�9��<��ҡ�zۇV@���X 6��hWh��X��|�Q:ت��qA"2�� ��DZ9�|	xʧ���Y]��7C���T!<�����Y�+e���Vc�D��Ia�!S�ª׈�X��� �P s��	p��<�CV�A�1p�988n�)@H��G�gg@�� X�}���Id�8d�Q�{�#�(*�.��Α��{#1Q�#��@; ��;`��)���VJ}p���d�}�&M>Jſ�����`�wBV�������^<|�;�H��sn!��&s����NsO�Q8��F���$1�%	�ɵ���9�L���� ����1�>��Oz_#��g�$G�w�M��c�>ǡl�s8�;c�B�gBj'Jq��8�� ��>��4)T�gU�`,j>�h$�4�܄���MR��9�1�<]\�n��u	?��@"d Oz������x��)���S��+z��[ �P�x����D��c߉~Q&2��U������Ù��伆u�.�KL��I�8&&[��ˉw�_H?�C�*e��awUtH�1�����_-?���r����1[�M_.�?i��oK��ej��__�/׋����j�Q���fu����|c���A��v�^ew�]��:�L�
n�S�D��YD)�@�Z��#+�O?�k=v���1?�pG%��P5|���>t�d�4Z��cT9�GWU� L��ܻ�T��Io���i�H�A\�ǳ!WD���#��%]{bI�n �˱��9���7 ���f���U)x�V"D;����F,!�3�Ȍ�<��񱤲VE(�* d���^����"��#�"��Q�\l��JYd�ۗ�ɦz4V��0���xA��j�2}���R4�){G�4�0B�T�'�'�iQ����orLTA0U�yt`�=84;�-����J�a���;9?,���\,��0����"�0�c5�T��2K�"����*D��R�c�T+���I4_$����V�(-�M!$���I��% ��E�0�K@1�>�<e8��6�)٨xd?D]�t�`���~I�-C���S'�F6I�b���B���1�9��Q�;��X�ǧ�a���J� *T4H��x6]��jĖe�!S�#�c� r����F�ϵ|h��4Lx�^�B�x�8�<��S(a{�L�G�����I������b�I���{E	\�N1��1f��a�=R���,���$%4=n/��	��JU4c��� B�����K�ª�8�VtTA������`C%�y�]����S�$�{?��gr���iT��Є�X����՞
gw�Q85+��t��GdhT�N�<������G8�d5�D%��y}�V�e��_+j�3���Bg@��_�So�ei�A'�&�I]�{,)��������܈/�F� ��)� IEJ��s�s���\_�|��w�(6�m���o��n~����7��6��^�ޫ��S���W��))HӗTGSіGX�l��(�Ƒ�Y�J\,Cc��(G��=�'ia�he��e�Jl��X�;jpy�f��T��'3qh%w	σ���	�Q	V��>dCS%�2��YJ�2$�| *@b��Q�ra�ϧ9�(����$=�Q�Ɍ|*�����Ɖg�� ^fh�A��'RjP���-�P�b��N���V�--*�����E�^(ө�@¸4�;��Q�ߘ�gJ��
��P���P��K�~�������$���FI�:D�>��nd��쫆TϡRBaw�%&9��"��L*<(@��"�u����t��KA�.��605[$�O�/�ِ�#�2Oq�Iz�	#|�I�#3t{�dG�&�#х�
t4c�J�_��4��� >�P)Q��la�=��	/�~q�f�s�L��$OPT,�����h�_6�iA�*��i����>x�y�)��]�U�X%�k�%=�� �ed-@I*:4��yc;���F�Eh��+J ��	$�P�������\�E��:�0J�O?��+O�.��~�K�=�Nf�z�dȾ��T��X�#E2��X�d��S�8�l�KN��4��̄(g&�L* m���{4����4329�ў	�?��Ş��b�� ��b�ψ�ʿ��LGM2u�Ց��RBL�\�c$p"��AٜFg�{Ʈ]$���|R�A2V0�6��ѩۿ���s��sZIo|/W�#�G]*5}k_9qσ�C$#h�m�FD0��N��]�f!��=�S*$����i+�/��,ee\I���J��&A�#������j4���d��͠�7h*�Th���[� �O�clǱ)#�vH���#$c6b�Y��dX7��J�м{�����~N��㔉Z�G�Oe �������@�VAj�龇ߦ�bb�1ͩ@ab�2O�4JQ&jr3��o��A�O��ղ����I���Qx
[�;��H�I)`* ��^E��(l�+�&�c_z&{�ȴ�N�$	5E��Czps�^-6wכ�Gу�e��ݬ�s��-��z5�[^-�W��z�lug��+hJ�鎊x��k��g�$�b�H.m�=]��,������ܼz���Q�����սyS�)Â'ŉk��(Z��ϥ��i��'��\^��v���'ЖH�$�e�
.�b����ǣb3|��N�����LJ��=���G%�yxe��1ʀ��F�%"�rb���T�'E0��uR�����D}���N�O��щD�nB)��g�3pU���lϓ�Ԃb���dp����K:D�'�Ip�84�m!FZb�2��]S3�OZ�2D��Nu���j�Gf0�g���p1��4��x�z��9@Q���t�4�zy9^����X����KoѾ�4WU&��q�k��q���2B�;m0k�jN����t2���| (W �� ���ɇ8�п��}����n��G�������㌧�z}c7����n��ol~3����wvY�V�y�*��g��-�U��c�W�]Weșx��W�����aSd����8�Jػ^��No����Ez�{h���y�Hh]V6(.���見De,�%횡�Mm���:+�Q�s��s��ɛ�u��/�P��om����9͝w~�+N�du����t#��IJ��q������݁N^4�?8I7H�Ӈ���O@~& �Ov!�d��Л������:����۬��      #   j  x��ұn�0�=O�--�DY:u������H�+�ݢ���x8��d#�?_ߞ�w�����3�C~���N�tw�)��Ѝ�%�}������[w��:Z�>@
� aI�*`C�ȅ���=�s<����?��i}b���F聒�m@�lU �C����\�:S[��1
��\b��s��

'�d����֚7���bIN�1X��1P��9�t"�/�L\���0-m�7x����E�B���C[�Q:k�/u�s��a��m�{Y�[fj��H}B�����a�"�2���WI�J���X ߷�Fe��Gm#���ś��yCD6&�'j+}�O��hPn�\eY벶�'�vۍ�      (   �   x�u�AO�0��;���.l�%�-2���H̖�镔�e�Jh5���ԝ��'��_����Ə��:��rnMC3�ঞ<�{�@O��F�23�ʇFiM��r	.({۞���'�CW����hZ�6����ߤ��^�^vGXǈ�i�q!�ĳB^R��2�3�-R3�Q�=�QBZT"�D�`.jg�[5�d��a��u��_�y��Ă.�Ť�0Kd!ez��CE_<�^E      %   
   x���          )   
   x���          &   q   x���v
Q���W((M��L�+�,I�)V��L�Q�K�M�Q�I-K��Ts�	uV�P7N43NM65�5I�0�5100ҵ�0��M1111NI4I644P�QP�IM- 24���� �j�     