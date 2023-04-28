/* eslint-disable react/jsx-key */
import { useRef, useState } from "react";
import {
  CloudDownloadOutlined,
  FormatPainterOutlined,
  SwitcherOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Image from "next/image";


import ResidenceCanvas00 from "./canvas/ResidenceCanvas00";
import ModelInfo from "@/components/modelInfo";
import PieChart from "./echarts/PieChart";
import { Double, Single } from "@/assets";

const Residence = () => {
  const [showLeva, setShowLeva] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parkRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  // console.log("activeTab", activeTab);

  const handlerExportModels = () => {
    console.log("exportModels");
    // parkRef.current.exportGLB();
    // parkRef.current.sayHello();
  };

  return (
    <div className='flex flex-col h-screen'>
      {/* 顶栏 */}
      <div className=' bg-blue-600 py-3 shadow-xl border-gray-900 z-20 '>
        <div className='px-4 mx-auto sm:px-6 lg:px-12 text-white text-xs '>
          智慧住宅方案生成 Smart Residence Planning
        </div>
      </div>
      <div className=' flex-grow flex'>
        {/* 左边栏 icon*/}
        <div className='relative bg-white p-4 shadow-lg'>
          {[
            // 全局参数
            <UnorderedListOutlined />,
            // 渲染模式
            <SwitcherOutlined />,
            // leva GUI
            <FormatPainterOutlined />,
          ].map((icon, index) => {
            return (
              <div
                onClick={() => setActiveTab(index)}
                key={index}
                className={`${
                  index === activeTab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                // className='flex flex-col items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-gray-200'
              >
                {icon}
              </div>
            );
          })}

          <div className='border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'>
            <CloudDownloadOutlined onClick={handlerExportModels} />
          </div>
        </div>
        {/* 左边栏 */}
        <div className=' relative bg-white w-[250px] p-1  hidden sm:block shadow-md'>
          <div className='flex flex-col p-2 gap-4'>
            <div>
              <div className='text-sm font-bold p-4'>PLAN INFORMATIONS</div>
            </div>
            <div className='w-auto h-auto bg-white text-xs'>
              <Image src={Single} alt='单层' priority />
              <div className='grid grid-cols-2 grid-rows-2 gap-2 p-2'>
                <div className='p-1'>室内面积</div>
                <div className='p-1 rounded-md shadow-md'>106.93m2</div>
                <div className='p-1'>绿色阳台面积</div>
                <div className='p-1 rounded-md shadow-md'>54.87m2</div>
              </div>
              <div className='flex justify-center mb-2'>
                <div className='p-1'>奇数层平面</div>
              </div>
            </div>
            <div className=' w-auto h-auto bg-white p-1 text-xs '>
              <Image src={Double} alt='双层' priority />
              <div className='grid grid-cols-2 grid-rows-2 gap-2 p-4'>
                <div className='p-1'>室内面积</div>
                <div className='p-1 rounded-md shadow-md'>106.93m2</div>
                <div className='p-1'>绿色阳台面积</div>
                <div className='p-1 rounded-md shadow-md'>54.87m2</div>
              </div>
              <div className='flex justify-center mb-2'>
                <div className='p-1'>偶数层平面</div>
              </div>
            </div>

            <div className='bg-center'>
              {/* <NightingaleChart /> */}
              <PieChart />
            </div>
          </div>
          {/* <div className='mx-auto'>
            {[
              // 全局参数
              <ParameterInputs />,
              // 渲染模式
              <RenderMode />,
              // leva GUI
              <Leva theme={levaTheme} fill hidden={activeTab == 0}></Leva>,
            ].map((item, index) => {
              return <div key={index}>{index === activeTab && item}</div>;
            })}
          </div> */}
        </div>
        {/* <div className='container absolute z-10 w-auto px-2 py-4 mx-auto left-[350px]'>
          <Leva theme={levaTheme} fill hidden={showLeva}></Leva>
        </div> */}

        {/* 主内容区 */}
        <div className='relative flex-grow p-6 bg-gray-200 shadow-lg'>
          <div className='w-full h-full absolute top-0 left-0'>
            <ResidenceCanvas00 />
            {/* <ResidenceCanvas01 /> */}
            {/* <VehicleScene /> */}
          </div>
          <div>
            <ModelInfo />
          </div>
          <div className='absolute bottom-1 left-0 right-0 text-center'>
            <p className='text-xs mx-auto text-white'>
              Smart Residence Planning
            </p>
          </div>
        </div>
        {/* 右边栏 */}
        {/* <div className='bg-white w-[300px] p-3 hidden lg:block shadow-lg'>
          <div className='container z-10 w-auto  mx-auto flex flex-col justify-between'>
            <SaveSolution />
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default Residence;
