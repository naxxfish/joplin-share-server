
CREATE TABLE "public"."notes" (
    "note_data" text NOT NULL,
    "note_encryption_type" text NOT NULL,
    "note_originator" text NOT NULL,
    "note_date_created" timestamp NOT NULL,
    "note_id" text NOT NULL,
    "note_version" bigint NOT NULL,
    CONSTRAINT "notes_note_id" PRIMARY KEY ("note_id")
) WITH (oids = false);