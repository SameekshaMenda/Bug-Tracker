# train.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import joblib

# Load and train
df = pd.read_csv('bug_type_dataset.csv')
model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(df['description'], df['category'])

# Save model
joblib.dump(model, 'bug_type_model.joblib')
