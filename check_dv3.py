with open('D:/DocNest/src/components/DocumentVault.tsx', 'rb') as f:
    content = f.read()
for i, b in enumerate(content):
    if b > 127 or (b < 32 and b not in (9, 10, 13)):
        ch = chr(b) if 32 <= b < 127 else '?'
        print('Byte', i, ':', b, '(', ch, ')')
