export type ActiveRouteItem = {
  date: string;
  destination: string;
  driverName: string;
  id: string;
  status: string;
  vehicleModel: string;
  vehiclePlate: string;
};

export type MonitoringTrackRecord = {
  capturedAt: string;
  id: string;
  imageKey: string | null;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  routeId: string;
};
