import re
from pathlib import Path
text = Path('pages/checkout/index.vue').read_text(encoding='utf-8')
match = re.search(r'<template>(.*?)</template>', text, re.S)
if not match:
    raise SystemExit('no template')
html = match.group(1)
print('div_diff', html.count('<div') - html.count('</div>'))
print('clientdiff', html.count('<client-only') - html.count('</client-only>'))
print('template_diff', html.count('<template>') - html.count('</template>'))
# token count
import re
pattern = re.compile(r'<(/?)([a-zA-Z0-9-]+)([^>]*)>')
stack=[]
voids={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
for m in pattern.finditer(html):
    closing = m.group(1) == '/'
    tag=m.group(2)
    attrs=m.group(3)
    if closing:
        if not stack:
            print('unmatched closing',tag)
        elif stack[-1]==tag:
            stack.pop()
        else:
            print('mismatch',tag,'expected',stack[-1] if stack else None)
            while stack and stack[-1]!=tag:
                stack.pop()
            if stack and stack[-1]==tag:
                stack.pop()
    else:
        if attrs.strip().endswith('/') or tag in voids:
            pass
        else:
            stack.append(tag)
print('stack remaining', stack)
