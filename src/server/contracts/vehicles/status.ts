export const VEHICLE_STATUSES = ["AVAILABLE", "IN_USE", "MAINTENANCE"] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];
