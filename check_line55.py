with open('D:/DocNest/src/pages/Dashboard.tsx', 'rb') as f:
    content = f.read()
lines = content.split(b'\n')
line_55 = lines[54]
print('Line 55 as string:', line_55.decode('utf-8'))
print('Length:', len(line_55))
for i, b in enumerate(line_55):
    if b > 127 or (b < 32 and b not in (9, 10, 13)):
        ch = chr(b) if 32 <= b < 127 else '?'
        print(f'Byte {i}: {b:02x} ({ch})')
