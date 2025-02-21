from django import forms
from .models import Product_table

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product_table
        fields = ['name', 'description', 'price', 'image']
