def feature_engineering(data):
    if all(col in data.columns for col in ['Extracurricular', 'Sports', 'Music', 'Volunteering']):
        data = data.copy()
        data['TotalEngagement'] = data[['Extracurricular', 'Sports', 'Music', 'Volunteering']].sum(axis=1)
        data = data.drop(columns=['Extracurricular', 'Sports', 'Music', 'Volunteering'])
    return data
