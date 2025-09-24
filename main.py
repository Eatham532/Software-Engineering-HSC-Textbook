def main():
    print("Hello from ai-textbook!")


if __name__ == "__main__":
    main()


def define_env(env):
    """Minimal hook for mkdocs-macros-plugin.

    The plugin requires one of: define_env, on_pre_page_macros,
    on_post_page_macros, or on_post_build. Provide a noop implementation
    so the module can be imported safely by the plugin.
    """
    try:
        # ensure variables mapping exists and expose a small namespace
        if not hasattr(env, 'variables'):
            env.variables = {}
        env.variables.setdefault('ai_textbook', {})
    except Exception:
        # Keep this function robust; failing here should not block the build.
        pass
    return env
