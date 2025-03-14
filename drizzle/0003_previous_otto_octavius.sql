CREATE TYPE "public"."broker_type" AS ENUM('Locação', 'Venda', 'Híbrido');--> statement-breakpoint
CREATE TYPE "public"."creci_type" AS ENUM('Definitivo', 'Estagiário', 'Matrícula');--> statement-breakpoint
CREATE TABLE "broker_neighborhoods" (
	"broker_id" uuid NOT NULL,
	"neighborhood_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "broker_neighborhoods_broker_id_neighborhood_id_pk" PRIMARY KEY("broker_id","neighborhood_id")
);
--> statement-breakpoint
CREATE TABLE "broker_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "broker_type" NOT NULL,
	"creci" varchar(50) NOT NULL,
	"creci_type" "creci_type" NOT NULL,
	"classification" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "broker_regions" (
	"broker_id" uuid NOT NULL,
	"region_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "broker_regions_broker_id_region_id_pk" PRIMARY KEY("broker_id","region_id")
);
--> statement-breakpoint
ALTER TABLE "broker_neighborhoods" ADD CONSTRAINT "broker_neighborhoods_broker_id_broker_profiles_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."broker_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broker_neighborhoods" ADD CONSTRAINT "broker_neighborhoods_neighborhood_id_neighborhoods_id_fk" FOREIGN KEY ("neighborhood_id") REFERENCES "public"."neighborhoods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broker_regions" ADD CONSTRAINT "broker_regions_broker_id_broker_profiles_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."broker_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broker_regions" ADD CONSTRAINT "broker_regions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;