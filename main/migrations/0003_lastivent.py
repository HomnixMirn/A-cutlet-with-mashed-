# Generated by Django 5.1.3 on 2024-12-06 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_rename_org_organization'),
    ]

    operations = [
        migrations.CreateModel(
            name='lastIvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('city', models.CharField(max_length=250)),
                ('mens', models.CharField(max_length=250)),
                ('discipline', models.CharField(max_length=250)),
                ('title', models.CharField(max_length=250)),
                ('format', models.CharField(max_length=250)),
                ('date_start', models.DateField()),
                ('date_end', models.DateField()),
            ],
        ),
    ]
