from pymavlink import mavutil

master = mavutil.mavlink_connection('udp:127.0.0.1:14550')

master.wait_heartbeat()

print("CONNECTED")

while True:

    msg = master.recv_match(
        type='GLOBAL_POSITION_INT',
        blocking=True
    )

    if msg:

        lat = msg.lat / 1e7
        lon = msg.lon / 1e7
        alt = msg.relative_alt / 1000

        print("LAT:", lat)
        print("LON:", lon)
        print("ALT:", alt)