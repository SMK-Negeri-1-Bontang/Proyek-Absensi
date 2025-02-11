<script setup>

</script>

<template>
        <html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
        }
        .card {
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body class="bg-gray-900 text-white">
    <div class="container mx-auto p-4">
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
                <i class="fas fa-user-circle text-2xl mr-2"></i>
                <span class="text-lg font-medium">Juno Iceclub</span>
            </div>
            <div>
                <i class="fas fa-sign-out-alt"></i> Log Out
            </div>
        </div>
        <div class="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                    <label for="nis" class="block mb-2 font-medium">NIS:</label>
                    <input type="text" id="nis" class="w-full p-2 rounded bg-gray-700 text-gray-300" placeholder="Type NIS">
                </div>
                <div>
                    <label for="class" class="block mb-2 font-medium">Class:</label>
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" id="class-x" class="form-checkbox text-gray-300">
                        <label for="class-x">X</label>
                        <input type="checkbox" id="class-xi" class="form-checkbox text-gray-300">
                        <label for="class-xi">XI</label>
                        <input type="checkbox" id="class-xii" class="form-checkbox text-gray-300">
                        <label for="class-xii">XII</label>
                        <input type="checkbox" id="class-xiii" class="form-checkbox text-gray-300">
                        <label for="class-xiii">XIII</label>
                    </div>
                </div>
                <div>
                    <label for="jurusan" class="block mb-2 font-medium">Jurusan:</label>
                    <select id="jurusan" class="w-full p-2 rounded bg-gray-700 text-gray-300">
                        <option>All Selected</option>
                    </select>
                    <div class="flex items-center space-x-2 mt-2">
                        <input type="checkbox" id="jurusan-a" class="form-checkbox text-gray-300">
                        <label for="jurusan-a">A</label>
                        <input type="checkbox" id="jurusan-b" class="form-checkbox text-gray-300">
                        <label for="jurusan-b">B</label>
                    </div>
                </div>
                <div>
                    <label for="tanggal" class="block mb-2 font-medium">Tanggal:</label>
                    <input type="date" id="tanggal" class="w-full p-2 rounded bg-gray-700 text-gray-300" value="2077-01-13">
                </div>
            </div>
        </div>
        <div class="space-y-4">
            <div class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg card">
                <div>
                    <h2 class="text-xl font-bold">Delphi Zoe</h2>
                    <p class="text-gray-400">Computer Science</p>
                    <p class="text-gray-500">12492372957295</p>
                </div>
                <div class="text-right">
                    <p class="text-green-500 text-xl font-bold">PRESENT</p>
                    <p class="text-gray-400">06:14:53 | Wednesday, 15 January 2077</p>
                </div>
            </div>
            <div class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg card">
                <div>
                    <h2 class="text-xl font-bold">Ryan Tamara</h2>
                    <p class="text-gray-400">Industry Automation</p>
                    <p class="text-gray-500">12492372957295</p>
                </div>
                <div class="text-right">
                    <p class="text-red-500 text-xl font-bold">LATE</p>
                    <p class="text-gray-400">06:14:53 | Wednesday, 15 January 2077</p>
                </div>
            </div>
            <div class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg card">
                <div>
                    <h2 class="text-xl font-bold">Dorime Ameno</h2>
                    <p class="text-gray-400">Industrial Chemistry</p>
                    <p class="text-gray-500">12492372957295</p>
                </div>
                <div class="text-right">
                    <p class="text-white text-xl font-bold">AWAITING</p>
                    <p class="text-gray-400">06:14:53 | Wednesday, 15 January 2077</p>
                </div>
            </div>
            <div class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg card">
                <div>
                    <h2 class="text-xl font-bold">Jennifer D. Vulkan</h2>
                    <p class="text-gray-400">Chemistry Analyst</p>
                    <p class="text-gray-500">12492372957295</p>
                </div>
                <div class="text-right">
                    <p class="text-yellow-500 text-xl font-bold">PERMISSON</p>
                    <p class="text-gray-400">06:14:53 | Wednesday, 15 January 2077</p>
                </div>
            </div>
            <div class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg card">
                <div>
                    <h2 class="text-xl font-bold">Ran Dee</h2>
                    <p class="text-gray-400">Vehicle Engineering</p>
                    <p class="text-gray-500">12492372957295</p>
                </div>
                <div class="text-right">
                    <p class="text-green-500 text-xl font-bold">ALFA</p>
                    <p class="text-gray-400">06:14:53 | Wednesday, 15 January 2077</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
</template>