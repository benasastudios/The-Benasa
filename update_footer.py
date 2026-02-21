#!/usr/bin/env python3
import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the form section
old_section = '''                <div>
                    <!-- Netlify Forms Configuration Applied Here -->
                    <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="space-y-6">
                        <!-- Hidden field for Netlify bot protection -->
                        <p class="hidden">
                            <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                        </p>
                        <!-- Form Name for Netlify dashboard -->
                        <input type="hidden" name="form-name" value="contact" />
                        
                        <div class="grid grid-cols-2 gap-6">
                            <input type="text" name="name" placeholder="NAME" required class="w-full bg-transparent border-b border-neutral-200 py-4 text-xs outline-none focus:border-black transition">
                            <input type="email" name="email" placeholder="EMAIL" required class="w-full bg-transparent border-b border-neutral-200 py-4 text-xs outline-none focus:border-black transition">
                        </div>
                        <select id="form-pack" name="package" class="w-full bg-transparent border-b border-neutral-200 py-4 text-xs outline-none focus:border-black transition">
                            <option value="Standard Pack">Standard Pack</option>
                            <option value="Trial Run">Trial Run</option>
                            <option value="On-Demand">On-Demand</option>
                        </select>
                        <textarea name="message" placeholder="PROJECT NOTES" rows="3" class="w-full bg-transparent border-b border-neutral-200 py-4 text-xs outline-none focus:border-black transition"></textarea>
                        <button type="submit" class="btn-black w-full py-5 text-[0.7rem] font-bold uppercase tracking-widest">Send Request</button>
                    </form>
                    <div id="form-success" class="hidden text-center py-10">
                        <p class="text-sm font-bold uppercase tracking-widest">Inquiry Received</p>
                    </div>
                </div>'''

new_section = '''                <div>
                    <div class="space-y-4 text-sm text-neutral-600 font-light">
                        <p class="font-bold uppercase text-xs tracking-widest">Get in Touch</p>
                        <div class="space-y-2">
                            <p><a href="https://www.instagram.com/benasastudios/" target="_blank" class="hover:text-black transition font-bold">Instagram</a></p>
                            <p><a href="mailto:benasastudios@gmail.com" class="hover:text-black transition">benasastudios@gmail.com</a></p>
                            <p><a href="https://wa.me/233554116131" target="_blank" class="hover:text-black transition">+233 55 411 6131</a></p>
                        </div>
                    </div>
                </div>'''

if old_section in content:
    content = content.replace(old_section, new_section)
    print("✓ Footer form replaced with contact links")
else:
    print("✗ Could not find footer form section")

# Also check for "Earn 10%" button wire
if 'onclick="openModal()"' in content and 'Earn 10%' in content:
    print("✓ Earn 10% button is wired to openModal()")
else:
    print("✗ Earn 10% button wiring not found")

# Write the file back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ index.html updated successfully")
