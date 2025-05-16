/*
  # Create categories table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `candidate_count` (integer, default 0)
      - `top_candidate_name` (text)
      - `top_candidate_votes` (integer)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `categories` table
    - Add policy for public read access
*/

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  candidate_count integer DEFAULT 0,
  top_candidate_name text,
  top_candidate_votes integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);