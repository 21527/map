import dynamic from "next/dynamic";

const CityModel = dynamic(() => import("./CityModel"));
const CityModel03 = dynamic(() => import("./CityModel03"));
const ParkModel = dynamic(() => import("./ParkModel"));
const ParkModel00 = dynamic(() => import("./ParkModel00"));
const ParkModel03 = dynamic(() => import("./ParkModel03"));
const RhinoModel0316 = dynamic(() => import("./RhinoModel0316"));
const Tree = dynamic(() => import("./Tree"));
const ResidenceModel = dynamic(() => import("./ResidenceModel"));
const ResidenceModel00 = dynamic(() => import("./ResidenceModel00"));
const ResidenceModel01 = dynamic(() => import("./ResidenceModel01"));
const ResidenceModel02 = dynamic(() => import("./ResidenceModel02"));
const FacadeModel = dynamic(() => import("./FacadeModel"));
const GenModel = dynamic(() => import("./GenModel"));

export {
  CityModel,
  CityModel03,
  ParkModel,
  ParkModel00,
  ParkModel03,
  Tree,
  RhinoModel0316,
  ResidenceModel,
  ResidenceModel00,
  ResidenceModel01,
  ResidenceModel02,
  FacadeModel,
};
// 从后端数据生成模型，通用
export { GenModel };
