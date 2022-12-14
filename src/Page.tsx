import { Plugin } from '@phonophant/shared-models';
import * as React from 'react';
import { useEffect, useState } from 'react';
import PluginCard from './Components/PluginCard';

export default () => {
  const [plugins, setPlugins] = useState<Plugin[]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [ updatingActiveState, setUpdatingActiveState ] = React.useState<string[]>([]);
  const [ updatingDeleteState, setUpdatingDeleteState ] = React.useState<string[]>([]);
  
  const onActiveToggle = async (plugin: Plugin) => {
    setUpdatingActiveState([...updatingActiveState, plugin.name]);

    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: plugin.name, active: !plugin.active })
    }
    const response = await fetch(
      `http://localhost:3000/plugin`,
      requestOptions,
    );
    if (!response.ok) {
      throw new Error(
        `This is an HTTP error: The status is ${response.status}`
      );
    }
    const patchedPlugin = await response.json();
    setPlugins(plugins.map(existingPlugin => existingPlugin.name !== plugin.name ? existingPlugin : patchedPlugin));
    setUpdatingActiveState(updatingActiveState.filter(pluginName => pluginName !== plugin.name));
  }
  

  const uninstall = async (pluginName: string) => {
    setUpdatingDeleteState([...updatingActiveState, pluginName]);

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: pluginName })
    }
    const response = await fetch(
      `http://localhost:3000/plugin`,
      requestOptions,
    );
    if (!response.ok) {
      throw new Error(
        `This is an HTTP error: The status is ${response.status}`
      );
    }
    setPlugins(plugins.filter(existingPlugin => existingPlugin.name !== pluginName));
    setUpdatingDeleteState(updatingActiveState.filter(existingPluginName => pluginName !== existingPluginName));
  }
  
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/plugins/installed`
        );
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setPlugins(actualData.plugins);
        setError(null);
      } catch(err) {
        setError(err.message);
        setPlugins(null);
      } finally {
        setLoading(false);
      }  
    }
    getData()
  }, []);
  
  return (
    <div className="px-10 py-10 mx-auto container align-middle">
      <div className="flex flex-wrap">
        {
          !loading && plugins?.map((plugin => <PluginCard plugin={plugin} onUninstallClick={() => uninstall(plugin.name)} onActiveToggle={() => onActiveToggle(plugin)}/>))
        }
        {
          !plugins && error && <div>An Error occured while loading the plugins.</div>
        }
      </div>
    </div>
  );
};
