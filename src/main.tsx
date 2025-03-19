import plugin from '../plugin.json';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from './ErrorBoundary';
import App from './App';

// Assuming WCPage is defined elsewhere in your type definitions
class AcodePlugin {
  public baseUrl: string | undefined;

  async init($page: WCPage, cacheFile: any, cacheFileUrl: string): Promise<void> {
    // Create a container for the React app
    const rootDiv = document.createElement('div');
    rootDiv.id = 'react-root';
    $page.append(rootDiv);

    // Create a React root and render the app
    const root = ReactDOM.createRoot(rootDiv);
    root.render(
      <ErrorBoundary>
        <App cacheFile={cacheFile} cacheFileUrl={cacheFileUrl} />
      </ErrorBoundary>
    );

    // Add editor commands (Acode specific)
    editorManager.editor.commands.addCommand({
      name: 'react-acode',
      description: 'React Acode Interface',
      bindKey: { win: 'Ctrl-m' },
      exec: () => $page.show(),
    });

    editorManager.editor.commands.addCommand({
      name: 'react-acode',
      description: 'React Acode Interface',
      bindKey: { win: 'Ctrl-Shift-r' },
      exec: () => $page.show(),
    });
  }

  async destroy(): Promise<void> {
    // Unmount the React app when the plugin is destroyed
    const rootDiv = document.getElementById('react-root');
    if (rootDiv) {
      ReactDOM.createRoot(rootDiv).unmount();
    }
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();

  acode.setPluginInit(
    plugin.id,
    async (baseUrl: string, $page: WCPage, { cacheFileUrl, cacheFile }: { cacheFileUrl: string, cacheFile: any }) => {
      if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
      }
      acodePlugin.baseUrl = baseUrl;
      await acodePlugin.init($page, cacheFile, cacheFileUrl);
    }
  );

  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
