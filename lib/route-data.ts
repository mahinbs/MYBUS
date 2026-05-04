export type RouteStops = {
  boarding: string[];
  dropping: string[];
};

const routeStopMap: Record<string, RouteStops> = {
  'Delhi|Bangalore': {
    boarding: ['Kashmere Gate ISBT', 'AIIMS Metro Station', 'Sarojini Nagar Stop'],
    dropping: ['Majestic Bus Stand', 'Madiwala', 'Electronic City'],
  },
  'Delhi|Jaipur': {
    boarding: ['Kashmere Gate ISBT', 'Rajouri Garden Metro', 'Anand Vihar ISBT'],
    dropping: ['Sindhi Camp Bus Stand', 'Durgapura Circle', 'Malviya Nagar'],
  },
  'Mumbai|Pune': {
    boarding: ['Borivali East', 'Dadar TT', 'Chembur Colony'],
    dropping: ['Shivaji Nagar', 'Wakad', 'Katraj'],
  },
  'Bangalore|Hyderabad': {
    boarding: ['Madiwala', 'Silk Board', 'Hebbal'],
    dropping: ['Ameerpet', 'Lakdikapul', 'MGBS'],
  },
};

const defaultStops: RouteStops = {
  boarding: ['Central Bus Terminal', 'City Metro Gate', 'Bypass Stop'],
  dropping: ['Main Bus Stand', 'City Center', 'Ring Road Junction'],
};

export function getRouteStops(from: string, to: string): RouteStops {
  const key = `${from.trim()}|${to.trim()}`;
  return routeStopMap[key] || defaultStops;
}
