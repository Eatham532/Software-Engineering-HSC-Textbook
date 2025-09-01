import yaml, sys, traceback
from markdown import Markdown

with open('mkdocs.yml', 'r', encoding='utf8') as f:
    data = yaml.safe_load(f)
md_ext = data.get('markdown_extensions')
print('Raw markdown_extensions node:')
import pprint
pprint.pprint(md_ext)

# Build extension list for python-markdown
exts = []
for item in md_ext:
    if isinstance(item, str):
        exts.append(item)
    elif isinstance(item, dict):
        # dict should be {name: options} but sometimes reversed; normalize
        if len(item) == 1:
            key = list(item.keys())[0]
            val = item[key]
            # If value is None, swap if key looks like option
            if val is None:
                # find a key whose value is not None and use that
                # fallback: include key
                exts.append(key)
            else:
                exts.append({key: val})
        else:
            # Multiple keys: try to transform to proper mapping
            # If there is 'toc' or 'pymdownx.highlight' nested, try to normalize
            exts.append(item)
    else:
        exts.append(item)

print('\nNormalized extension list:')
pprint.pprint(exts)

print('\nAttempting to initialize Markdown with these extensions...')
try:
    md = Markdown(extensions=exts)
    print('Markdown initialized OK')
except Exception as e:
    print('Markdown init failed:')
    traceback.print_exc()
    sys.exit(1)

print('\nAll good')
