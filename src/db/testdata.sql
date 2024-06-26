INSERT INTO collective (id, name, c_address, c_wallet, c_pool, honey_pot, created_at, "expiresAt", meme_token_contract) 
VALUES (6, 'Mochi', '0x33BB0ff596764ab881c8aD9ae550A9D503329982', '0x83c60A93d4F41774eA14Ad7e60f6607dBd08D55e', '0x078D323F420c74265e906c6Df3f00fcB46CdF11B', '0x20Da640F24Eaa435C7ED63f8a5aDa0836A438f1B', NOW(), NOW() + INTERVAL '5 weeks', '0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50');

INSERT INTO collective (id, name, c_address, c_wallet, c_pool, honey_pot, created_at, "expiresAt", meme_token_contract) 
VALUES (7, 'Toshi', '0x92A153f1Ed93D2D88f805C947fb7e572644b913E', '0x77bE0E984DEF3551BB24D116b182313c190E31f5', '0x97Ba6d67F1abB2e1D7426C662ECB71dc4B5E53Cc', '0x64fFB432c03b974DC05c6AF731D7f0CFD0f27eDD', NOW(), NOW() + INTERVAL '5 weeks', '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4');

INSERT INTO collective (id, name, c_address, c_wallet, c_pool, honey_pot, created_at, "expiresAt", meme_token_contract) 
VALUES (8, 'Base God', '0x46C7208595FD18c7Fc16153935C6515521497Dd6', '0xF0B91E07b0Bbe082deE28a35a7861429b3562c63', '0xbA398d4B8719dd6f9ca0227D6DBE9918E26a4eb5', '0xEdddeafaA5D7c65494e0dFA0e327820D4CbD826e', NOW(), NOW() + INTERVAL '5 weeks', '0x0d97F261b1e88845184f678e2d1e7a98D9FD38dE');

INSERT INTO collective (id, name, c_address, c_wallet, c_pool, honey_pot, created_at, "expiresAt", meme_token_contract) 
VALUES (9, 'Brett', '0x994EF022cE98179DaC8b00987D3C6C97Df0A9410', '0xF4d291fdf7850ba3387137372cCBd0087251c93b1', '0x606D5ab363ad58CCD9814464AE7545E9754be075', '0x22531467ce7e3c6c9Ff2Af17B7AFe93D473F344E', NOW(), NOW() + INTERVAL '5 weeks', '0x532f27101965dd16442E59d40670FaF5eBB142E4');






INSERT INTO collective (id, name, c_address, c_wallet, c_pool, honey_pot,  "expiresAt", meme_token_contract) 
VALUES (10, 'Normie', 'XXX', 'XXX', 'XXX', 'XXX',  NOW() + INTERVAL '5 weeks', '0x7F12d13B34F5F4f0a9449c16Bcd42f0da47AF200');

INSERT INTO collective (id, name, c_address, c_wallet, c_pool, honey_pot, "expiresAt", meme_token_contract) 
VALUES (11, 'Mfer', 'XXX', 'XXX', 'XXX', 'XX',  NOW() + INTERVAL '5 weeks', '0xE3086852A4B125803C815a158249ae468A3254Ca');

INSERT INTO collective (id, name, c_address, c_wallet, c_pool, honey_pot,  "expiresAt", meme_token_contract) 
VALUES (12, 'DEGEN', 'XXX', 'XXX', 'XXX', 'XXX',  NOW() + INTERVAL '5 weeks', '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed');

INSERT INTO collective (id, name, c_address, c_wallet, c_pool, honey_pot,  "expiresAt", meme_token_contract) 
VALUES (13, 'Doginme', 'XXX', 'XXX', 'XXX', 'XXX',  NOW() + INTERVAL '5 weeks', '0x6921B130D297cc43754afba22e5EAc0FBf8Db75b');

INSERT INTO collective (id, name, c_address, c_wallet, c_pool, honey_pot,  "expiresAt", meme_token_contract) 
VALUES (14, 'Benji', 'XXX', 'XXX', 'XXX', 'XXX',  NOW() + INTERVAL '5 weeks', '0xBC45647eA894030a4E9801Ec03479739FA2485F0');

INSERT INTO collective (id, name, c_address, c_wallet, c_pool, honey_pot,  "expiresAt", meme_token_contract) 
VALUES (15, 'Higher', 'XXX', 'XXX', 'XXX', '0x762C51FdD2944D9BCcf9F61D9d34de48daF3E2C1',  NOW() + INTERVAL '5 weeks', '0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe');




UPDATE collective 
SET 
  c_address = CASE 
                WHEN id = 10 THEN '0x832f88700496b56715245b029003516508dCb229'
                WHEN id = 11 THEN '0xDA6Ad119635b409fDFABD8ec30C907Ab1558921D'
                WHEN id = 12 THEN '0x955334AdaE3CD860a64AF0b72f7645869af812B4'
                WHEN id = 13 THEN '0xA941DB63B32204D51A8F15F01A43F4640d5B527f' 
                WHEN id = 14 THEN '0x0b290b835FdDd46b40d0E8C72b6Af5e246e42852'
                WHEN id = 15 THEN '0xb71e5D33a548689Cb7e907630748123E6AB17942'
              END,
  c_wallet = CASE 
                WHEN id = 10 THEN '0x7A99C931443Ae497Bbd3A4190f7C36f112082507'
                WHEN id = 11 THEN '0x0Ca94b8Bc0e7bc75aD250a1505b461C85F0da229'
                WHEN id = 12 THEN '0xdd699172cEDA340dc78c4a9706C80d641a3d43f3'
                WHEN id = 13 THEN '0x7e49216f56b7b6FE095d229C6880035D8e4C6164'
                WHEN id = 14 THEN '0x08f6C0E149dc08f87a26EffFEE426816449C03ea'
                WHEN id = 15 THEN '0x9E07c3f931fB8E9efF013496C19ee62B0c81d13D'
              END,
  c_pool = CASE 
                WHEN id = 10 THEN '0x06e65ddEe4fE3d60105FA788722CEbc706920199'
                WHEN id = 11 THEN '0x467a73f506eBa82082042062D5b02D2635A5b56b'
                WHEN id = 12 THEN '0xc0f0f8E633Aec35f9F098d62A50689411b88f7ce'
                WHEN id = 13 THEN  '0xEC14850b75AfA4B33D69932F29E4a86253F80346'
                WHEN id = 14 THEN '0x8D7A351AE540cfc63979773C2003D3e51B871d49'
                WHEN id = 15 THEN '0xb364b6A37dDC477F2c3CF564190850ac7bd8463C'
              END,
  honey_pot = CASE 
                WHEN id = 10 THEN '0xdf164012DF273761fD829412adbFA6fB357Ae654'
                WHEN id = 11 THEN '0x96eBAdcBBf89cc081CbcF12021C059E0A7148e9D'
                WHEN id = 12 THEN '0x762C51FdD2944D9BCcf9F61D9d34de48daF3E2C1'
                WHEN id = 13 THEN '0x57f4B9F3508afC397ef704577C276e59D2881823'
                WHEN id = 14 THEN '0xA07d4e4f66FFAfEf0f67fe3328a5E08a92f3e621'
                WHEN id = 15 THEN '0x8F2Fa00082C5CB2FaA1379CcB1652f621f9c0722'
              END
WHERE id IN (10, 11, 12, 13, 14, 15);



/* [
{
"honeyPot": "0x20Da640F24Eaa435C7ED63f8a5aDa0836A438f1B",
"c_address": "0x33BB0ff596764ab881c8aD9ae550A9D503329982",
"c_wallet": "0x83c60A93d4F41774eA14Ad7e60f6607dBd08D55e",
"c_pool": "0x078D323F420c74265e906c6Df3f00fcB46CdF11B"
},
{
"honeyPot": "0x64fFB432c03b974DC05c6AF731D7f0CFD0f27eDD",
"c_address": "0x92A153f1Ed93D2D88f805C947fb7e572644b913E",
"c_wallet": "0x77bE0E984DEF3551BB24D116b182313c190E31f5",
"c_pool": "0x97Ba6d67F1abB2e1D7426C662ECB71dc4B5E53Cc"
},
{
"honeyPot": "0xEdddeafaA5D7c65494e0dFA0e327820D4CbD826e",
"c_address": "0x46C7208595FD18c7Fc16153935C6515521497Dd6",
"c_wallet": "0xF0B91E07b0Bbe082deE28a35a7861429b3562c63",
"c_pool": "0xbA398d4B8719dd6f9ca0227D6DBE9918E26a4eb5"
},
{
"honeyPot": "0x22531467ce7e3c6c9Ff2Af17B7AFe93D473F344E",
"c_address": "0x994EF022cE98179DaC8b00987D3C6C97Df0A9410",
"c_wallet": "0xF4d291fdf7850ba3387137372cBd0087251c93b1",
"c_pool": "0x606D5ab363ad58CCD9814464AE7545E9754be075"
},
{
"honeyPot": "0xdf164012DF273761fD829412adbFA6fB357Ae654",
"c_address": "0x832f88700496b56715245b029003516508dCb229",
"c_wallet": "0x7A99C931443Ae497Bbd3A4190f7C36f112082507",
"c_pool": "0x06e65ddEe4fE3d60105FA788722CEbc706920199"
},
{
"honeyPot": "0x96eBAdcBBf89cc081CbcF12021C059E0A7148e9D",
"c_address": "0xDA6Ad119635b409fDFABD8ec30C907Ab1558921D",
"c_wallet": "0x0Ca94b8Bc0e7bc75aD250a1505b461C85F0da229",
"c_pool": "0x467a73f506eBa82082042062D5b02D2635A5b56b"
},
{
"honeyPot": "0x762C51FdD2944D9BCcf9F61D9d34de48daF3E2C1",
"c_address": "0x955334AdaE3CD860a64AF0b72f7645869af812B4",
"c_wallet": "0xdd699172cEDA340dc78c4a9706C80d641a3d43f3",
"c_pool": "0xc0f0f8E633Aec35f9F098d62A50689411b88f7ce"
},

{
"honeyPot": "0x57f4B9F3508afC397ef704577C276e59D2881823",
"c_address": "0x0b290b835FdDd46b40d0E8C72b6Af5e246e42852",
"c_wallet": "0x08f6C0E149dc08f87a26EffFEE426816449C03ea",
"c_pool": "0x8D7A351AE540cfc63979773C2003D3e51B871d49"
},
{
"honeyPot": "0xA07d4e4f66FFAfEf0f67fe3328a5E08a92f3e621",
"c_address": "0xA941DB63B32204D51A8F15F01A43F4640d5B527f",
"c_wallet": "0x7e49216f56b7b6FE095d229C6880035D8e4C6164",
"c_pool": "0xEC14850b75AfA4B33D69932F29E4a86253F80346"
},
{
"honeyPot": "0x8F2Fa00082C5CB2FaA1379CcB1652f621f9c0722",
"c_address": "0xb71e5D33a548689Cb7e907630748123E6AB17942",
"c_wallet": "0x9E07c3f931fB8E9efF013496C19ee62B0c81d13D",
"c_pool": "0xb364b6A37dDC477F2c3CF564190850ac7bd8463C"
}

] */
/* • Mochi: 0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50
• Toshi: 0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4
• TYBG or Base God: 0x0d97F261b1e88845184f678e2d1e7a98D9FD38dE
• Brett: 0x532f27101965dd16442E59d40670FaF5eBB142E4
• Normie: 0x7F12d13B34F5F4f0a9449c16Bcd42f0da47AF200
• mfer: 0xE3086852A4B125803C815a158249ae468A3254Ca
• DEGEN: 0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed
• doginme: 0x6921B130D297cc43754afba22e5EAc0FBf8Db75b
• Benji: 0xBC45647eA894030a4E9801Ec03479739FA2485F0 
• Higher: 0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe
 */