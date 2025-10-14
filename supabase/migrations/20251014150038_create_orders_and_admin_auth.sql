/*
  # Order History and Admin Authentication System

  1. New Tables
    - `orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `customer_name` (text) - Customer's full name
      - `customer_phone` (text) - Customer's phone number
      - `customer_email` (text, optional) - Customer's email address
      - `delivery_address` (text) - Delivery address
      - `items` (jsonb) - Order items with quantities and prices
      - `total_amount` (numeric) - Total order amount
      - `notes` (text, optional) - Additional order notes
      - `created_at` (timestamptz) - Order creation timestamp
    
    - `admin_auth`
      - `id` (uuid, primary key) - Auth record identifier
      - `password_hash` (text) - Hashed admin password
      - `failed_attempts` (integer) - Number of consecutive failed login attempts
      - `locked_until` (timestamptz, optional) - Lockout expiration timestamp
      - `last_attempt_at` (timestamptz, optional) - Last login attempt timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Orders table is read-only from client (insert only)
    - Admin auth is completely restricted from client access
    - All admin operations will go through edge functions

  3. Indexes
    - Index on orders.created_at for efficient sorting
    - Index on admin_auth.locked_until for lockout checks
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_address text NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create admin_auth table
CREATE TABLE IF NOT EXISTS admin_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash text NOT NULL,
  failed_attempts integer DEFAULT 0,
  locked_until timestamptz,
  last_attempt_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_auth_locked_until ON admin_auth(locked_until);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_auth ENABLE ROW LEVEL SECURITY;

-- Orders policies: allow anyone to insert (for order submission)
CREATE POLICY "Allow order insertion"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin auth policies: no direct client access (all operations through edge functions)
CREATE POLICY "Block all direct access to admin_auth"
  ON admin_auth FOR ALL
  TO anon
  USING (false);

-- Insert default admin record (password will be set via edge function on first use)
INSERT INTO admin_auth (password_hash, failed_attempts)
VALUES ('', 0)
ON CONFLICT DO NOTHING;