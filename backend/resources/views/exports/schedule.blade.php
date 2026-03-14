<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Schedule Export</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; text-align: left; }
        th, td { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
        th { background-color: #f4f4f4; font-weight: bold; }
        h2 { text-align: center; color: #333; }
        .session { margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 2px; }
        .session:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    </style>
</head>
<body>
    <h2>Weekly Schedule</h2>
    <table>
        <thead>
            <tr>
                <th>Teacher</th>
                @foreach($workDays as $day)
                    <th>{{ $day }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($schedules as $row)
                <tr>
                    <td><strong>{{ $row['teacher'] }}</strong></td>
                    @foreach($workDays as $day)
                        <td>
                            @if(isset($row[$day]) && !empty($row[$day]))
                                @php
                                    $sessions = explode("\n", $row[$day]);
                                @endphp
                                @foreach($sessions as $session)
                                    <div class="session">{{ $session }}</div>
                                @endforeach
                            @endif
                        </td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
