with open('D:/DocNest/src/components/DocumentVault.tsx', 'rb') as f:
    content = f.read()
print('Length:', len(content))
print('First 4 bytes:', content[:4].hex())
print('First 100 bytes:')
for i, b in enumerate(content[:100]):
    if b > 127 or (b < 32 and b not in (9, 10, 13)):
        ch = chr(b) if 32 <= b < 127 else '?'
        print(f'Byte {i}: {b:02x} ({ch})')
