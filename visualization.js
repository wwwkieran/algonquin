// Function to show loading screen
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

// Function to hide loading screen and show content
function hideLoadingAndShowContent() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('chart').classList.remove('hidden');
    document.querySelectorAll('.section').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.landing').forEach(el => el.classList.remove('hidden'));
}

// Function to load all data
async function loadData() {
    showLoading();
    try {
        const [
            parkBoundary,
            lakes,
            portages,
            lakes_visited,
            booth_to_farm_canoe,
            booth_to_farm_portage,
            canoe_to_opeongo_long_canoe,
            canoe_to_opeongo_long_portages,
            canoe_to_opeongo_med_canoe,
            canoe_to_opeongo_med_portages,
            canoe_to_opeongo_short_canoe,
            canoe_to_opeongo_short_portages,
            smoke_to_whitney_canoe,
            smoke_to_whitney_portage,
        ] = await Promise.all([
            d3.json('fixed_algonquin_boundary.geojson'),
            d3.json('lakes_simplified_combined.geojson'),
            d3.json('algonquin_portages.geojson'),
            d3.json('lakes_ive_visited.geojson'),
            d3.json('trips/booth_to_farm_canoe.geojson'),
            d3.json('trips/booth_to_farm_portage.geojson'),
            d3.json('trips/canoe_to_opeongo_long_canoe.geojson'),
            d3.json('trips/canoe_to_opeongo_long_portages.geojson'),
            d3.json('trips/canoe_to_opeongo_med_canoe.geojson'),
            d3.json('trips/canoe_to_opeongo_med_portages.geojson'),
            d3.json('trips/canoe_to_opeongo_short_canoe.geojson'),
            d3.json('trips/canoe_to_opeongo_short_portages.geojson'),
            d3.json('trips/smoke_to_whitney_canoe.geojson'),
            d3.json('trips/smoke_to_whitney_portage.geojson')
        ]);

        createChart(parkBoundary, lakes, portages, lakes_visited,
            booth_to_farm_canoe,
            booth_to_farm_portage,
            canoe_to_opeongo_long_canoe,
            canoe_to_opeongo_long_portages,
            canoe_to_opeongo_med_canoe,
            canoe_to_opeongo_med_portages,
            canoe_to_opeongo_short_canoe,
            canoe_to_opeongo_short_portages,
            smoke_to_whitney_canoe,
            smoke_to_whitney_portage);
        hideLoadingAndShowContent();
    } catch (error) {
        console.error("Error loading the data:", error);
        document.getElementById('loading').textContent = 'Error loading data. Please refresh the page.';
    }
}

function createChart(algonquin_park_boundary,
                     algonquin_lakes,
                     algonquin_portages,
                     lakes_visited,
                     booth_to_farm_canoe,
                     booth_to_farm_portage,
                     canoe_to_opeongo_long_canoe,
                     canoe_to_opeongo_long_portages,
                     canoe_to_opeongo_med_canoe,
                     canoe_to_opeongo_med_portages,
                     canoe_to_opeongo_short_canoe,
                     canoe_to_opeongo_short_portages,
                     smoke_to_whitney_canoe,
                     smoke_to_whitney_portage,
                     ) {
    const width = 0.9*window.innerWidth;
    const height = 0.9*window.innerHeight;
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;")
    var projection = d3.geoAlbers()
        .fitExtent([[0, ((window.innerHeight - height) / 2) + 20], [width, height]], algonquin_park_boundary);

    const path = d3.geoPath(projection);
    const g = svg.append("g");
    const outline = g.append("g")
        .attr("fill", "#ffffff")
        .attr("stroke", "#000000")
        .attr("stroke-width", 0.4)
        .selectAll("path")
        .data(algonquin_park_boundary.features)
        .join("path")
        .attr("d", path)



    const lakes = g.append("g")
        .attr("fill", "#ccecff")
        // .attr("stroke", "#000000")
        // .attr("stroke-width", 1)
        .selectAll("path")
        .data(algonquin_lakes.features)
        .join("path")
        .attr("d", path);


    const portages = g.append("g")
        .attr("stroke", "#c00043")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", 0.5)
        .attr("fill", "none")
        .selectAll("path")
        .data(algonquin_portages.features)
        .join("path")
        .on("click", clicked)
        .attr("d", path);

    const lakesVisited = g.append("g")
        .attr("fill", "#0077be")  // A blue color for visited lakes
        .selectAll("path")
        .data(lakes_visited.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);

    const initial_route_color = "#704b05"
    const initial_route_width = 3

    const boothToFarmCanoe = g.append("g")
        .attr("stroke", initial_route_color)  // Green for canoe routes
        .attr("stroke-width", initial_route_width)
        .attr("fill", "none")
        .selectAll("path")
        .data(booth_to_farm_canoe.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);

    const boothToFarmPortage = g.append("g")
        .attr("stroke", initial_route_color)  // Orange for portages
        .attr("stroke-width", initial_route_width)
        .attr("fill", "none")
        .selectAll("path")
        .data(booth_to_farm_portage.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);

    const canoeToOpeongoLongCanoe = g.append("g")
        .attr("stroke", initial_route_color)
        .attr("stroke-width", initial_route_width)
        .attr("fill", "none")
        .selectAll("path")
        .data(canoe_to_opeongo_long_canoe.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);

    const canoeToOpeongoLongPortages = g.append("g")
        .attr("stroke", initial_route_color)
        .attr("stroke-width", initial_route_width)
        .attr("fill", "none")
        .selectAll("path")
        .data(canoe_to_opeongo_long_portages.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);

    const canoeToOpeongoMedCanoe = g.append("g")
        .attr("stroke", initial_route_color)  // Light Blue for canoe routes
        .attr("stroke-width", initial_route_width)
        .attr("fill", "none")
        .selectAll("path")
        .data(canoe_to_opeongo_med_canoe.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);

    const canoeToOpeongoMedPortages = g.append("g")
        .attr("stroke", initial_route_color)  // Deep Orange for portages
        .attr("stroke-width", initial_route_width)
        .attr("fill", "none")
        .selectAll("path")
        .data(canoe_to_opeongo_med_portages.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);

    const canoeToOpeongoShortCanoe = g.append("g")
        .attr("stroke", initial_route_color)  // Cyan for canoe routes
        .attr("stroke-width", initial_route_width)
        .attr("fill", "none")
        .selectAll("path")
        .data(canoe_to_opeongo_short_canoe.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);

    const canoeToOpeongoShortPortages = g.append("g")
        .attr("stroke", initial_route_color)  // Pink for portages
        .attr("stroke-width", initial_route_width)
        .attr("fill", "none")
        .selectAll("path")
        .data(canoe_to_opeongo_short_portages.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);

    const smokeToWhitneyCanoe = g.append("g")
        .attr("stroke", initial_route_color)  // Light Green for canoe routes
        .attr("stroke-width", initial_route_width)
        .attr("fill", "none")
        .selectAll("path")
        .data(smoke_to_whitney_canoe.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);

    const smokeToWhitneyPortage = g.append("g")
        .attr("stroke", initial_route_color)  // Purple for portages
        .attr("stroke-width", initial_route_width)
        .attr("fill", "none")
        .selectAll("path")
        .data(smoke_to_whitney_portage.features)
        .join("path")
        .attr("d", path).attr("opacity", 0);


    const allCanoeLegs = [boothToFarmCanoe, canoeToOpeongoLongCanoe, canoeToOpeongoMedCanoe, canoeToOpeongoShortCanoe, smokeToWhitneyCanoe]
    const allPortageLegs = [boothToFarmPortage, canoeToOpeongoLongPortages, canoeToOpeongoMedPortages, canoeToOpeongoShortPortages, smokeToWhitneyPortage]

    function clicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        portages.transition().style("fill", null);
        d3.select(this).transition().style("fill", "red");
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.pointer(event, svg.node())
        );
    }


    document.getElementById('chart').appendChild(svg.node());

    // Scroll-based transitions
    function handleScroll() {
        function percentScrolled(i) {
            return (scrollPosition - i * windowHeight) / windowHeight
        }
        function setAttrForArray(array, k, v) {
            for (let el of array) {
                el.attr(k, v)
            }
        }


        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        if (scrollPosition < windowHeight) {
            lakes.attr("opacity", 0);
            portages.attr("opacity", 0);

            outline.attr("opacity", 0.3 + 0.7*percentScrolled(0));
        } else if (scrollPosition < 2 * windowHeight) {
            outline.attr("opacity", 1);
            portages.attr("opacity", 0);
            lakes.attr("opacity", 1).attr("stroke", "#000000").attr("stroke-width", 0);

            lakes.attr("opacity", percentScrolled(1));

        } else if (scrollPosition < 3 * windowHeight) {
            outline.attr("opacity", 1);
            lakes.attr("opacity", 1).attr("stroke", "#252da4").attr("stroke-width", 0.01);
            setAttrForArray(allCanoeLegs, "opacity", 0)
            setAttrForArray(allPortageLegs, "opacity", 0)

            portages.attr("opacity", percentScrolled(2));

        } else if (scrollPosition < 4 * windowHeight) {
            outline.attr("opacity", 1);
            lakes.attr("opacity", 1).attr("stroke", "#252da4").attr("stroke-width", 0.01);
            portages.attr("opacity", 1);


            setAttrForArray(allCanoeLegs, "opacity", percentScrolled(3))
            setAttrForArray(allCanoeLegs, "stroke-dasharray", 0.75)
            setAttrForArray(allPortageLegs, "opacity", percentScrolled(3))
            setAttrForArray(allPortageLegs, "stroke-dasharray", 0.75)
        }else if (scrollPosition < 5 * windowHeight) {
            // Portage analysis
            lakes.attr("opacity", 1).attr("stroke", "#252da4").attr("stroke-width", 0);
            setAttrForArray(allPortageLegs, "opacity", 1)
            lakesVisited.attr("opacity", 0)


            lakes.attr("opacity", 1 - 2*percentScrolled(4));
            setAttrForArray(allCanoeLegs, "opacity", 1 - 2*percentScrolled(4))

        } else if (scrollPosition < 6 * windowHeight) {
            // Lake analysis
            lakes.attr("opacity", 1).attr("stroke", "#252da4").attr("stroke-width", 0);
            portages.attr("opacity", 0);
            lakesVisited.attr("opacity", 0)



            portages.attr("opacity", 1 - 2*percentScrolled(5));
            setAttrForArray(allPortageLegs, "opacity", 1 - 2*percentScrolled(5))
            lakes.attr("opacity", percentScrolled(5)/1.1);
            lakesVisited.attr("opacity", percentScrolled(5))
        } else if (scrollPosition < 7 * windowHeight) {
            // Back to normal

            lakesVisited.attr("opacity", 1 - 2*percentScrolled(6))
            lakes.attr("opacity", 1/1.1 + (0.1/1.1)*2*percentScrolled(6));
            if (percentScrolled(6) > 0.5) {
                lakes.attr("opacity", 1).attr("stroke", "#252da4").attr("stroke-width", 0.01);
            }
            portages.attr("opacity", percentScrolled(6));



        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set initial state
}

// Call the loadData function when the script runs
loadData();


