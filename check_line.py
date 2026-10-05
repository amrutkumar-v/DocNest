with open('D:/DocNest/src/pages/Dashboard.tsx', 'rb') as f:
    content = f.read()
lines = content.split(b'\n')
line_139 = lines[138]
print('Line 139 as string:', line_139.decode('utf-8'))
print('Bytes 24-52:')
for i, b in enumerate(line_139[24:52]):
    ch = chr(b) if 32 <= b < 127 else '?'
    print(f'  Pos {24+i}: {b:02x} ({ch})')
