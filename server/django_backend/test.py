import psycopg2

try:
    conn = psycopg2.connect(
        dbname="juspaid",  # Replace with your database name
        user="postgres",   # Replace with your database user
        password="postgres123",  # Replace with your password
        host="localhost",
        port="5432"
    )
    print("Database connection successful!")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
