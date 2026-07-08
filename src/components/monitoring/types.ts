export type ActiveRouteItem = {
  date: string;
  destination: string;
  driverName: string;
  id: string;
  status: string;
  vehicleModel: string;
  vehiclePlate: string;
};

export type MonitoringPhotoRecord = {
  capturedAt: string;
  id: string;
  imageUrl: string;
  locationText?: string | null;
};
