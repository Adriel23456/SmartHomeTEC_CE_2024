PGDMP               
    	    |            SmartHomeTEC_Database    10.23    16.4 	    �
           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �
           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �
           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �
           1262    16393    SmartHomeTEC_Database    DATABASE     �   CREATE DATABASE "SmartHomeTEC_Database" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Costa Rica.1252';
 '   DROP DATABASE "SmartHomeTEC_Database";
                postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �
           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    6            �            1259    16394    Admin    TABLE     o   CREATE TABLE public."Admin" (
    email character varying NOT NULL,
    password character varying NOT NULL
);
    DROP TABLE public."Admin";
       public            postgres    false    6            �
          0    16394    Admin 
   TABLE DATA           2   COPY public."Admin" (email, password) FROM stdin;
    public          postgres    false    196   "       n
           2606    16401    Admin pk_email_admin 
   CONSTRAINT     W   ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT pk_email_admin PRIMARY KEY (email);
 @   ALTER TABLE ONLY public."Admin" DROP CONSTRAINT pk_email_admin;
       public            postgres    false    196            �
      x������ � �     