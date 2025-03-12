const Announcements = () => {
    return (
        <div className="bg-white p-4 rounded-md">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold ">Announcements</h1>
                <span className="text-gray-400 text-xs">View All</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-starSkyLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">Lorem ipsum dolor sit amet</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md">2025-04-04</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
                        expedita. Rerum, quidem facilis?
                    </p>
                </div>
                <div className="bg-starPurpleLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">Lorem ipsum dolor sit amet</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md">2025-04-04</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
                        expedita. Rerum, quidem facilis?
                    </p>
                </div>
                <div className="bg-starYellowLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">Lorem ipsum dolor sit amet</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md">2025-04-04</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
                        expedita. Rerum, quidem facilis?
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Announcements