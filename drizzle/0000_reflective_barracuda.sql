CREATE TYPE "public"."user_type" AS ENUM('Admin', 'Gerente', 'Corretor', 'Usuário');

-- statement-breakpoint
CREATE TABLE "user_types" (
    "id" integer PRIMARY KEY NOT NULL,
    "name" varchar(50) NOT NULL
);

-- statement-breakpoint
CREATE TABLE "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    "phone" varchar(20),
    "user_type_id" integer NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "deleted" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp,
    CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_type_id_user_types_id_fk" FOREIGN KEY ("user_type_id") REFERENCES "public"."user_types"("id") ON DELETE no action ON UPDATE no action;
