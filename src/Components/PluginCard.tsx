import * as React from 'react';
import { IoTrashBinOutline, IoSettingsOutline, IoCloseCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { NpmPlugin, Plugin } from '@phonophant/shared-models';

interface PluginCardProps {
  plugin: Plugin;
  onUninstallClick: () => void;
  onActiveToggle: () => void;
}

const PluginCard: React.FC<PluginCardProps> = ({ plugin, onUninstallClick, onActiveToggle }) => {
  
  return (
    <div className="shadow rounded-lg py-3 px-5 mx-3 my-2 w-96 bg-white">
      <div className="text-xl font-bold">
        { plugin.name }
      </div>
      <div className="flex mt-2">
        {
          plugin.tags?.map((tag) => (
            <div className="mr-4 text-xs inline-flex items-center leading-sm uppercase px-3 py-1 rounded-full bg-white text-gray-700 border">
              {tag}
            </div>  
          ))
        }
      </div>
      <div className="my-4 h-12 truncate whitespace-normal">
        { plugin.description || <p className="text-gray-200">No description available.</p> }
      </div>
          
      <div className="flex flex-wrap mt-6 space-x-5">
        <div className={`flex justify-start items-center space-x-1 rounded px-3 py-1 cursor-pointer ${plugin.active ? "bg-red-200" : "bg-blue-200"}`} onClick={() => onActiveToggle()}>
          { plugin.active ? <IoCloseCircleOutline/> : <IoCheckmarkCircleOutline/> }
          <p>{plugin.active ? "Disable" : "Enable"}</p>
        </div>
        <div className="flex justify-start items-center space-x-1 rounded px-3 py-1 cursor-pointer bg-red-200" onClick={() => onUninstallClick()}>
          <IoTrashBinOutline/>
          <p>Uninstall</p>
        </div>
        <div className="flex justify-start items-center space-x-1 rounded px-3 py-1 cursor-pointer bg-gray-200">
          <IoSettingsOutline/>
          <p>Settings</p>
        </div>
      </div>
      <div className="w-full text-xs text-gray-400 flex justify-between mt-2">
        <div className="truncate">
          { (plugin as NpmPlugin).packageName || 'Manually installed' }
        </div>
        <div className="truncate">
          { plugin.author || 'No Author' }
        </div>
      </div>
    </div>
  );
};

export default PluginCard;