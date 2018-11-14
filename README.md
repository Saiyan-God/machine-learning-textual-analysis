# machine-learning-textual-analysis
Machine Learning for Textual Analysis

## Setup and Run Project (Linux)
1. Setup your environment (preferably virtual environment)
    * Install `virtualenv`: https://gist.github.com/Geoyi/d9fab4f609e9f75941946be45000632b
    * Activate your virtual environment: `source <environment_name>/bin/activate`
    * Install dependencies: (NOTE: python3.6+ is required)
        ```
        pip3 install -r requirements.txt
        ```
2. `cd` into the Django project `textual_analysis`
3. Run the server from command line: `python3 manage.py runserver`
4. The application should be accessible at 127.0.0.1:8000 (localhost:8000)