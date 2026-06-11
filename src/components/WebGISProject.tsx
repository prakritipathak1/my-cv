import type { Layer, GeoJSON as LeafletGeoJSON, LeafletMouseEvent } from "leaflet";
import { control } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";

// Parse CSV data and aggregate population by district
async function loadPopulationData(): Promise<Record<string, number>> {
  const response = await fetch('/census-data.csv');
  const csv = await response.text();
  const lines = csv.split('\n').slice(1); // Skip header
  
  const populationMap: Record<string, number> = {};
  
  lines.forEach(line => {
    if (!line.trim()) return;
    const parts = line.split(',');
    if (parts.length >= 6) {
      let district = parts[1].trim();
      const population = parseInt(parts[5].trim(), 10);
      
      if (!isNaN(population)) {
        // Normalize district names to match GeoJSON
        if (district === 'Rukum East' || district === 'Rukum West') {
          district = 'RUKUM';
        } else if (district === 'Nawalparasi East' || district === 'Nawalparasi West') {
          district = 'NAWALPARASI';
        } else if (district === 'Chitawan') {
          district = 'CHITWAN';
        } else if (district === 'Kavrepalanchok') {
          district = 'KAVRE';
        } else if (district === 'Terhathum') {
          district = 'TEHRATHUM';
        } else {
          // Convert to uppercase for matching with GeoJSON
          district = district.toUpperCase();
        }
        
        if (!populationMap[district]) {
          populationMap[district] = 0;
        }
        populationMap[district] += population;
      }
    }
  });
  
  return populationMap;
}

function getPopulation(name: string, populationMap: Record<string, number>): number {
  // GeoJSON district names are already uppercase
  return populationMap[name] || 0;
}

// Color scale for Choropleth based on Population
function getColor(d: number) {
  return d > 1000000 ? "#800026" :
         d > 800000  ? "#BD0026" :
         d > 600000  ? "#E31A1C" :
         d > 400000  ? "#FC4E2A" :
         d > 200000  ? "#FD8D3C" :
         d > 100000  ? "#FEB24C" :
                       "#FFEDA0";
}

function style(feature: any) {
  return {
    fillColor: getColor(feature.properties.population),
    weight: 1,
    opacity: 1,
    color: "rgba(255,255,255,0.3)",
    fillOpacity: 0.7,
  };
}

// Subcomponent to handle useMap hooks and GeoJSON events
function GeoJSONLayer({ data, setHoveredFeature, searchedDistrict }: { data: any, setHoveredFeature: any, searchedDistrict: string }) {
  const map = useMap();
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);

  useEffect(() => {
    if (searchedDistrict && geoJsonRef.current) {
      geoJsonRef.current.eachLayer((layer: any) => {
        if (layer.feature.properties.DISTRICT.toLowerCase() === searchedDistrict.toLowerCase()) {
          map.flyToBounds(layer.getBounds(), { duration: 1.5, padding: [50, 50] });
          layer.bringToFront();
          layer.setStyle({ weight: 4, color: "#00f5d4", fillOpacity: 0.9 });
          
          setTimeout(() => {
            if (geoJsonRef.current) {
              geoJsonRef.current.resetStyle(layer);
            }
          }, 3000);
        }
      });
    }
  }, [searchedDistrict, map]);

  const onEachFeature = (feature: any, layer: Layer) => {
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle({
          weight: 3,
          color: "#fff",
          fillOpacity: 0.9,
        });
        target.bringToFront();
        setHoveredFeature(feature.properties);
      },
      mouseout: (e: LeafletMouseEvent) => {
        const target = e.target;
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(target);
        }
        setHoveredFeature(null);
      },
      click: (e: LeafletMouseEvent) => {
        map.fitBounds(e.target.getBounds());
      }
    });
  };

  return <GeoJSON ref={geoJsonRef} data={data} style={style} onEachFeature={onEachFeature} />;
}

function ZoomControls() {
  const map = useMap();

  useEffect(() => {
    const zoomControl = control.zoom({ position: "bottomleft" });
    zoomControl.addTo(map);
    return () => {
      zoomControl.remove();
    };
  }, [map]);

  return null;
}

export function WebGISProject() {
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredFeature, setHoveredFeature] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch('/nepal-districts-simplified.json').then(res => res.json()),
      loadPopulationData()
    ])
      .then(([geoJsonData, populationMap]) => {
        // Preprocess to add population attribute from real census data
        geoJsonData.features.forEach((f: any) => {
          f.properties.population = getPopulation(f.properties.DISTRICT, populationMap);
        });
        setGeoData(geoJsonData);
      })
      .catch(err => console.error("Error loading data", err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
  };

  return (
    <section id="webgis" className="mx-auto max-w-6xl px-6 py-20 md:py-28" data-reveal>
      <div className="mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// featured webgis</div>
        <h2 className="mt-2 text-4xl font-bold md:text-5xl">Interactive Geospatial Dashboard</h2>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          A high-performance WebGIS application mapping Nepal's districts. Featuring a choropleth map 
          dynamically styled by population, optimized GeoJSON rendering, smooth hover events, and zoom-on-click navigation.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl glass p-1 shadow-2xl glow-primary/20 ring-1 ring-white/10">
        <div className="relative h-[70vh] rounded-[20px] overflow-hidden bg-background">
          {geoData ? (
            <MapContainer 
              center={[28.3949, 84.1240]} // Centered on Nepal
              zoom={7} 
              scrollWheelZoom={false} 
              zoomControl={false}
              className="h-full w-full z-0"
              style={{ background: "#0b0c10" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
              />
              <ZoomControls />
              <GeoJSONLayer 
                data={geoData} 
                setHoveredFeature={setHoveredFeature} 
                searchedDistrict={activeSearch}
              />
            </MapContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground font-mono animate-pulse">
              Loading GeoJSON Map Data...
            </div>
          )}

          {/* Search Control */}
          <div className="absolute top-4 left-4 z-[1000] w-72">
            <form onSubmit={handleSearch} className="rounded-xl glass p-4 shadow-xl backdrop-blur-xl bg-background/80 border border-white/10">
              <h4 className="font-mono text-xs text-primary mb-3 uppercase tracking-wider">Search District</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Kathmandu"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
                />
                <button type="submit" className="rounded-lg bg-primary/20 text-primary px-3 hover:bg-primary/30 transition flex items-center justify-center">
                  🔍
                </button>
              </div>
            </form>
          </div>

          {/* Custom Info Control (Floating Panel) */}
          <div className="absolute top-4 right-4 z-[1000] min-w-[240px] rounded-xl glass p-5 shadow-xl backdrop-blur-xl bg-background/80 border border-white/10 transition-all duration-300">
            <h4 className="font-mono text-xs text-primary mb-2 uppercase tracking-wider">District Insights</h4>
            {hoveredFeature ? (
              <div className="animate-fade-up">
                <div className="text-2xl font-bold text-foreground mb-1">{hoveredFeature.DISTRICT}</div>
                <div className="mt-3 font-mono text-xs text-muted-foreground uppercase">Population</div>
                <div className="text-3xl font-bold text-gradient mt-1">
                  {hoveredFeature.population.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic py-4">Hover over a district to view population data</div>
            )}
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-6 right-6 z-[1000] rounded-xl glass p-4 shadow-xl backdrop-blur-xl bg-background/80 border border-white/10">
            <h4 className="font-mono text-[10px] text-muted-foreground mb-3 uppercase tracking-wider">Population Legend</h4>
            <div className="space-y-2">
              {[1000000, 800000, 600000, 400000, 200000, 100000, 0].map((d, i, arr) => (
                <div key={d} className="flex items-center gap-3 text-xs font-mono">
                  <span className="w-4 h-4 rounded-sm border border-black/20 shadow-inner" style={{ backgroundColor: getColor(d + 1) }}></span>
                  <span className="text-foreground/80">
                    {d === 1000000 ? '1M+' : `${(d/1000)}k ${arr[i-1] ? `– ${(arr[i-1]/1000)}k` : '+'}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
