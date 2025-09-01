import yaml
import pprint
with open('mkdocs.yml', 'r', encoding='utf8') as f:
    data = yaml.safe_load(f)
me = data.get('markdown_extensions')
print(type(me))
pprint.pprint(me)
