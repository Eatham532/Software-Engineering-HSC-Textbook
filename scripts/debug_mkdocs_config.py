from mkdocs.config import load_config
import traceback

try:
    cfg = load_config('mkdocs.yml')
    print('Loaded config OK')
    # print some keys
    print('markdown_extensions:', cfg.get('markdown_extensions'))
    print('plugins:', cfg.get('plugins'))
except Exception:
    traceback.print_exc()
