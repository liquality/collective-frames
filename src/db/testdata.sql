DO $$
BEGIN
  INSERT INTO collective (name, c_address, c_wallet, c_pool, "expiresAt")
  VALUES ('HPOS10', '0x123456789', '0x987654321', '0xabcdef123456789', NOW() + INTERVAL '5 weeks');
END $$;

DO $$
BEGIN
  INSERT INTO collective (name, c_address, c_wallet, c_pool, "expiresAt")
  VALUES ('Degen', '0x987654321', '0xabcdef123', '0x123456789abcdef', NOW() + INTERVAL '5 weeks');
END $$;

DO $$
BEGIN
  INSERT INTO collective (name, c_address, c_wallet, c_pool, "expiresAt")
  VALUES ('Enjoy', '0xabcdef123', '0x123456789', '0x987654321abcdef', NOW() + INTERVAL '5 weeks');
END $$;
